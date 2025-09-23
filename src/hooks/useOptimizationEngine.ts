'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

// Global flag to prevent multiple optimization engine instances
let globalOptimizationEngineActive = false;

interface TrainData {
  train: {
    train_id: string;
    type: string;
    priority: number;
    status: string;
    max_speed_kmh: number;
    destination_station: string;
    current_location: {
      section_id: string;
      position_m: number;
    };
    direction: string;
    restricted_speed?: boolean;
    breakdown_until?: string;
  };
  event: {
    delay_duration_min?: number;
  };
  section: {
    section_id: string;
    is_disrupted: boolean;
  };
}

interface Conflict {
  type: string;
  section: string;
  capacity?: number;
  current_trains?: string[];
  occupied_by?: string[];
  approaching?: string[];
  severity: string;
}

interface OptimizationSchedule {
  now_epoch_s: number;
  horizon_s: number;
  snapshot_trains_considered: number;
  schedule: Record<string, {
    target_section: string;
    entry_offset_s: number;
    entry_epoch_s: number;
    action: string;
    priority: number;
    status: string;
  }>;
}

interface OptimizationEngineState {
  currentTrains: TrainData[];
  conflicts: Conflict[];
  optimizationResults: OptimizationSchedule | null;
  isOptimizing: boolean;
  lastOptimized: Date | null;
  error: string | null;
  isPolling: boolean;
  useGroqAI: boolean;
  previousSchedule: OptimizationSchedule | null;
}

const useOptimizationEngine = (
  apiBaseUrl: string = 'http://localhost:8000',
  pollingInterval: number = 20000, // 20 seconds like Python decision_taker.py
  groqApiKey?: string,
  autoStart: boolean = false
) => {
  const [state, setState] = useState<OptimizationEngineState>({
    currentTrains: [],
    conflicts: [],
    optimizationResults: null,
    isOptimizing: false,
    lastOptimized: null,
    error: null,
    isPolling: false,
    useGroqAI: !!groqApiKey,
    previousSchedule: null,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const optimizingRef = useRef(false);
  const isPollingRef = useRef(false);
  const lastOptimizationTime = useRef(0); // Track last optimization time
  const hasAutoStartedRef = useRef(false); // Track if auto-start has already been attempted

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      globalOptimizationEngineActive = false;
      optimizingRef.current = false;
      isPollingRef.current = false;
      hasAutoStartedRef.current = false;
    };
  }, []);

  // Auto-start polling if requested (only once per hook instance)
  useEffect(() => {
    if (autoStart && !hasAutoStartedRef.current && !globalOptimizationEngineActive) {
      console.log('useOptimizationEngine: Auto-starting optimization engine');
      hasAutoStartedRef.current = true;
      startPolling();
    }
  }, []); // Empty dependency array - only run once on mount

  // Section capacity mapping (same as Python decision_taker.py)
  const sectionCapacity: Record<string, number> = {
    "SEC_1": 2, "SEC_2": 1, "SEC_3": 2,
    "SEC_4": 1, "SEC_5": 3, "SEC_6": 1
  };

  // Section graph (same as Python decision_taker.py)
  const sectionGraph: Record<string, { next: string[]; stations: string[]; length_km: number }> = {
    "SEC_1": { next: ["SEC_2"], stations: ["STN_A", "STN_B"], length_km: 8.5 },
    "SEC_2": { next: ["SEC_3"], stations: ["STN_B", "STN_C"], length_km: 6.2 },
    "SEC_3": { next: ["SEC_4"], stations: ["STN_C", "STN_D"], length_km: 7.8 },
    "SEC_4": { next: ["SEC_5"], stations: ["STN_D", "STN_E"], length_km: 5.3 },
    "SEC_5": { next: ["SEC_6"], stations: ["STN_E", "STN_F"], length_km: 9.1 },
    "SEC_6": { next: [], stations: ["STN_B", "STN_E"], length_km: 12.0 }
  };

  // Fetch train data from API (same as Python decision_taker.py fetchTrainData)
  const fetchTrainData = useCallback(async (): Promise<TrainData[] | null> => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/train-data`, {
        timeout: 30000,
      });
      return response.data?.payload || [];
    } catch (error) {
      console.error('Failed to fetch train data:', error);
      setState(prev => ({ ...prev, error: 'Failed to fetch train data' }));
      return null;
    }
  }, [apiBaseUrl]);

  // Analyze conflicts (same logic as Python decision_taker.py analyzeConflicts)
  const analyzeConflicts = useCallback((trains: TrainData[]): Conflict[] => {
    const conflicts: Conflict[] = [];
    const sectionOccupancy: Record<string, string[]> = {};

    // Track current occupancy
    trains.forEach(train => {
      const trainData = train.train;
      if (!['Arrived', 'Cancelled'].includes(trainData.status)) {
        const sectionId = trainData.current_location?.section_id;
        if (sectionId) {
          if (!sectionOccupancy[sectionId]) {
            sectionOccupancy[sectionId] = [];
          }
          sectionOccupancy[sectionId].push(trainData.train_id);
        }
      }
    });

    // Check for capacity violations
    Object.entries(sectionOccupancy).forEach(([sectionId, occupiedTrains]) => {
      const capacity = sectionCapacity[sectionId] || 1;
      if (occupiedTrains.length > capacity) {
        conflicts.push({
          type: 'capacity_exceeded',
          section: sectionId,
          capacity,
          current_trains: occupiedTrains,
          severity: 'high'
        });
      }
    });

    // Check for potential collisions in single-track sections
    Object.entries(sectionOccupancy).forEach(([sectionId, occupiedTrains]) => {
      if ((sectionCapacity[sectionId] || 1) === 1 && occupiedTrains.length > 0) {
        const approaching: string[] = [];
        
        trains.forEach(train => {
          const trainData = train.train;
          const trainId = trainData.train_id;
          
          if (!occupiedTrains.includes(trainId)) {
            const currentSection = trainData.current_location?.section_id;
            if (currentSection && sectionGraph[currentSection]?.next) {
              if (sectionGraph[currentSection].next.includes(sectionId)) {
                approaching.push(trainId);
              }
            }
          }
        });

        if (approaching.length > 0) {
          conflicts.push({
            type: 'single_track_conflict',
            section: sectionId,
            occupied_by: occupiedTrains,
            approaching,
            severity: 'medium'
          });
        }
      }
    });

    return conflicts;
  }, [sectionCapacity, sectionGraph]);

  // Create optimization prompt (exact same as Python decision_taker.py)
  const createOptimizationPrompt = useCallback((trains: TrainData[], conflicts: Conflict[]): string => {
    const currentTime = new Date();
    const currentEpoch = Math.floor(currentTime.getTime() / 1000);

    const activeTrains = trains.filter(train => 
      !['Arrived', 'Cancelled'].includes(train.train.status)
    );

    let prompt = `You are an expert railway traffic controller. Your task is to optimize train scheduling to minimize delays and conflicts.

CURRENT SITUATION:
- Current time: ${currentTime.toISOString()}
- Current epoch: ${currentEpoch}
- Total active trains: ${activeTrains.length}

RAILWAY NETWORK:
- SEC_1: STN_A→STN_B (8.5km, capacity: 2, double track)
- SEC_2: STN_B→STN_C (6.2km, capacity: 1, single track)
- SEC_3: STN_C→STN_D (7.8km, capacity: 2, double track)
- SEC_4: STN_D→STN_E (5.3km, capacity: 1, single track)
- SEC_5: STN_E→STN_F (9.1km, capacity: 3, double track)
- SEC_6: STN_B→STN_E (12.0km, capacity: 1, single track, bypass route)

CURRENT TRAINS:
`;

    activeTrains.forEach(train => {
      const trainData = train.train;
      const location = trainData.current_location || {};
      prompt += `- ${trainData.train_id}: ${trainData.type || 'Unknown'} (Priority: ${trainData.priority || 1}) `;
      prompt += `at ${location.section_id || 'Unknown'} position ${location.position_m || 0}m, `;
      prompt += `Status: ${trainData.status || 'Unknown'}, `;
      prompt += `Destination: ${trainData.destination_station || 'Unknown'}, `;
      prompt += `Max Speed: ${trainData.max_speed_kmh || 100}km/h\n`;
    });

    if (conflicts.length > 0) {
      prompt += '\nIDENTIFIED CONFLICTS:\n';
      conflicts.forEach(conflict => {
        prompt += `- ${conflict.type} at ${conflict.section}: ${JSON.stringify(conflict)}\n`;
      });
    }

    prompt += `
OPTIMIZATION OBJECTIVES:
1. Prioritize high-priority trains (Express=5, Local=3, Freight=2)
2. Minimize total delay time
3. Avoid conflicts in single-track sections (SEC_2, SEC_4, SEC_6)
4. Optimize capacity utilization
5. Consider train speeds and journey times

CONSTRAINTS:
- Single-track sections can only handle one train at a time
- Trains cannot reverse direction
- Higher priority trains should be scheduled first
- Safety margins must be maintained

Please generate an optimized schedule in the following JSON format:
{
  "now_epoch_s": ${currentEpoch},
  "horizon_s": 3600,
  "snapshot_trains_considered": ${activeTrains.length},
  "schedule": {
    "TRAIN_ID": {
      "target_section": "SEC_X",
      "entry_offset_s": 0,
      "entry_epoch_s": ${currentEpoch},
      "action": "proceed|hold_until_YYYY-MM-DDTHH:MM:SS|reroute",
      "priority": 1-5,
      "status": "On time|Delayed|Waiting"
    }
  }
}

Consider these actions:
- "proceed": Allow immediate movement
- "hold_until_TIMESTAMP": Hold train until specified time
- "reroute": Use alternative path (SEC_6 as bypass)

Focus on the most critical trains first. Provide only the JSON response without additional explanation.
`;

    return prompt;
  }, []);

  // Get optimized schedule using Groq LLaMA 3.3 (same as Python decision_taker.py)
  const getOptimizedScheduleWithGroq = useCallback(async (trains: TrainData[], conflicts: Conflict[]): Promise<OptimizationSchedule> => {
    if (!groqApiKey) {
      console.warn('No Groq API key provided, using fallback optimization');
      return generateFallbackSchedule(trains);
    }

    try {
      const prompt = createOptimizationPrompt(trains, conflicts);
      
      // Call Groq API (you'll need to implement this as a backend endpoint since Groq requires server-side calls)
      const response = await axios.post(`${apiBaseUrl}/api/groq-optimization`, {
        prompt,
        model: "llama-3.3-70b-versatile",
        temperature: 0.1,
        max_tokens: 2048,
        top_p: 0.9
      }, {
        timeout: 30000,
        headers: { 'Content-Type': 'application/json' }
      });

      const content = response.data.content?.trim();
      console.log(`LLaMA response length: ${content?.length || 0} characters`);

      // Extract JSON from response
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}') + 1;

      if (jsonStart === -1 || jsonEnd <= jsonStart) {
        throw new Error('No valid JSON found in response');
      }

      const jsonStr = content.substring(jsonStart, jsonEnd);
      const schedule = JSON.parse(jsonStr);

      // Validate schedule structure
      if (!schedule || typeof schedule !== 'object' || !schedule.schedule) {
        throw new Error('Invalid schedule structure');
      }

      console.log(`Generated Groq schedule for ${Object.keys(schedule.schedule || {}).length} trains`);
      return schedule;

    } catch (error) {
      console.error('Error generating Groq optimized schedule:', error);
      console.log('Falling back to intelligent optimization');
      return generateIntelligentFallbackSchedule(trains, conflicts);
    }
  }, [apiBaseUrl, groqApiKey, createOptimizationPrompt]);

  // Generate intelligent fallback schedule (enhanced version of Python _generateFallbackSchedule)
  const generateIntelligentFallbackSchedule = useCallback((trains: TrainData[], conflicts: Conflict[]): OptimizationSchedule => {
    const currentTime = new Date();
    const currentEpoch = Math.floor(currentTime.getTime() / 1000);

    const activeTrains = trains.filter(train => 
      !['Arrived', 'Cancelled'].includes(train.train.status)
    );

    const schedule: Record<string, any> = {};
    
    // Sort by priority and analyze conflicts (more intelligent than simple fallback)
    const sortedTrains = [...activeTrains].sort((a, b) => {
      // First by priority (higher first)
      const priorityDiff = (b.train.priority || 1) - (a.train.priority || 1);
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by status (running trains first)
      const statusOrder = { 'Running': 0, 'Delayed': 1, 'Stopped': 2, 'Boarding': 3 };
      return (statusOrder[a.train.status as keyof typeof statusOrder] || 4) - 
             (statusOrder[b.train.status as keyof typeof statusOrder] || 4);
    });

    // Track section occupancy for conflict resolution
    const sectionOccupancy: Record<string, string[]> = {};
    const sectionSchedule: Record<string, number> = {}; // Next available time for each section

    sortedTrains.forEach((train, index) => {
      const trainData = train.train;
      const currentSection = trainData.current_location?.section_id || 'SEC_1';
      
      // Check for conflicts in current or target sections
      const isInConflict = conflicts.some(conflict => 
        conflict.current_trains?.includes(trainData.train_id) ||
        conflict.approaching?.includes(trainData.train_id)
      );

      let action = 'proceed';
      let entryTime = currentEpoch;
      let targetSection = currentSection;

      if (isInConflict) {
        // Handle conflict resolution
        const conflictingSection = conflicts.find(c => 
          c.current_trains?.includes(trainData.train_id) || 
          c.approaching?.includes(trainData.train_id)
        );

        if (conflictingSection) {
          const sectionId = conflictingSection.section;
          const capacity = sectionCapacity[sectionId] || 1;
          const currentOccupancy = sectionOccupancy[sectionId]?.length || 0;

          if (currentOccupancy >= capacity) {
            // Hold train until section is available
            const baseDelay = 60; // 1 minute base delay
            const priorityDelay = Math.max(0, 5 - (trainData.priority || 1)) * 30; // Lower priority = more delay
            const positionDelay = index * 15; // Sequential delay based on processing order
            
            const totalDelay = baseDelay + priorityDelay + positionDelay;
            entryTime = currentEpoch + totalDelay;
            action = `hold_until_${new Date((currentEpoch + totalDelay) * 1000).toISOString()}`;
            
            console.log(`Train ${trainData.train_id} delayed by ${totalDelay}s due to ${conflictingSection.type}`);
          }
        }
      }

      // Track section usage
      if (!sectionOccupancy[targetSection]) {
        sectionOccupancy[targetSection] = [];
      }
      sectionOccupancy[targetSection].push(trainData.train_id);
      sectionSchedule[targetSection] = Math.max(sectionSchedule[targetSection] || currentEpoch, entryTime + 30);

      schedule[trainData.train_id] = {
        target_section: targetSection,
        entry_offset_s: entryTime - currentEpoch,
        entry_epoch_s: entryTime,
        action: action,
        priority: trainData.priority || 1,
        status: isInConflict ? 'Conflict resolved' : 'Optimized'
      };
    });

    return {
      now_epoch_s: currentEpoch,
      horizon_s: 3600,
      snapshot_trains_considered: activeTrains.length,
      schedule
    };
  }, [sectionCapacity]);

  // Generate simple fallback schedule (same as Python _generateFallbackSchedule)
  const generateFallbackSchedule = useCallback((trains: TrainData[]): OptimizationSchedule => {
    const currentTime = new Date();
    const currentEpoch = Math.floor(currentTime.getTime() / 1000);

    const activeTrains = trains.filter(train => 
      !['Arrived', 'Cancelled'].includes(train.train.status)
    );

    const schedule: Record<string, any> = {};
    let offset = 0;

    // Sort by priority (higher first)
    const sortedTrains = [...activeTrains].sort((a, b) => 
      (b.train.priority || 1) - (a.train.priority || 1)
    );

    sortedTrains.forEach(train => {
      const trainData = train.train;
      const currentSection = trainData.current_location?.section_id || 'SEC_1';

      schedule[trainData.train_id] = {
        target_section: currentSection,
        entry_offset_s: offset,
        entry_epoch_s: currentEpoch + offset,
        action: 'proceed',
        priority: trainData.priority || 1,
        status: trainData.status || 'On time'
      };

      offset += 30; // 30-second intervals
    });

    return {
      now_epoch_s: currentEpoch,
      horizon_s: 3600,
      snapshot_trains_considered: activeTrains.length,
      schedule
    };
  }, []);

  // Save schedule to backend (same as Python decision_taker.py save_schedule)
  const saveSchedule = useCallback(async (schedule: OptimizationSchedule): Promise<void> => {
    try {
      // Save to backend API (same as Python decision_taker.py)
      await axios.post(`${apiBaseUrl}/api/optimization/results`, schedule, {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Optimization results sent to API server');
      
      // Also save to local storage as backup
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `train_schedule_${timestamp}`;
      localStorage.setItem(filename, JSON.stringify(schedule));
      console.log(`Schedule saved locally as ${filename}`);
      
    } catch (error) {
      console.error('Failed to send results to API:', error);
      
      // Save locally even if API fails
      try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `train_schedule_${timestamp}_offline`;
        localStorage.setItem(filename, JSON.stringify(schedule));
        console.log(`Schedule saved locally (offline) as ${filename}`);
      } catch (localError) {
        console.error('Failed to save locally:', localError);
      }
    }
  }, [apiBaseUrl]);

  // Get optimized schedule (main optimization logic from Python decision_taker.py)
  const getOptimizedSchedule = useCallback(async (trains: TrainData[]): Promise<OptimizationSchedule> => {
    const conflicts = analyzeConflicts(trains);

    // If Groq API key is available, try AI optimization
    if (state.useGroqAI && groqApiKey) {
      try {
        console.log('Attempting Groq AI optimization...');
        return await getOptimizedScheduleWithGroq(trains, conflicts);
      } catch (error) {
        console.error('Groq AI optimization failed:', error);
        console.log('Falling back to intelligent optimization');
      }
    }

    // Use intelligent fallback optimization
    if (conflicts.length > 0 || trains.length > 3) {
      console.log('Using intelligent conflict resolution optimization');
      return generateIntelligentFallbackSchedule(trains, conflicts);
    } else {
      console.log('Using simple fallback optimization');
      return generateFallbackSchedule(trains);
    }
  }, [state.useGroqAI, groqApiKey, analyzeConflicts, getOptimizedScheduleWithGroq, generateIntelligentFallbackSchedule, generateFallbackSchedule]);

  // Single optimization cycle (same as Python decision_taker.py optimizeTraffic)
  const optimizeTraffic = useCallback(async (): Promise<OptimizationSchedule | null> => {
    const now = Date.now();
    
    // Prevent calls that are too frequent (minimum 15 seconds between optimizations)
    if (now - lastOptimizationTime.current < 15000) {
      console.log('Skipping optimization - too soon since last run');
      return null;
    }
    
    // Check if optimization engine is still active
    if (!globalOptimizationEngineActive) {
      console.log('Optimization engine not active, skipping');
      return null;
    }
    
    if (optimizingRef.current) {
      console.log('Optimization already in progress, skipping...');
      return null;
    }

    optimizingRef.current = true;
    lastOptimizationTime.current = now;
    setState(prev => ({ ...prev, isOptimizing: true, error: null }));

    try {
      console.log('Starting traffic optimization cycle');

      // Fetch current train data
      const trains = await fetchTrainData();
      if (!trains) {
        setState(prev => ({ ...prev, error: 'Failed to fetch train data' }));
        return null;
      }

      console.log(`Processing ${trains.length} trains`);

      // Analyze conflicts
      const conflicts = analyzeConflicts(trains);
      console.log(`Found ${conflicts.length} conflicts`);

      // Generate optimized schedule
      const schedule = await getOptimizedSchedule(trains);

      // Save schedule
      await saveSchedule(schedule);

      // Update state
      setState(prev => ({
        ...prev,
        currentTrains: trains,
        conflicts,
        optimizationResults: schedule,
        lastOptimized: new Date(),
        error: null,
        previousSchedule: prev.optimizationResults
      }));

      console.log(`Optimization completed. Schedule contains ${Object.keys(schedule.schedule || {}).length} trains`);

      // Print summary (same as Python decision_taker.py)
      const activeSchedules = schedule.schedule || {};
      const proceedCount = Object.values(activeSchedules).filter(s => s.action === 'proceed').length;
      const holdCount = Object.values(activeSchedules).filter(s => s.action.includes('hold_until')).length;
      const rerouteCount = Object.values(activeSchedules).filter(s => s.action === 'reroute').length;

      console.log(`Actions: ${proceedCount} proceed, ${holdCount} hold, ${rerouteCount} reroute`);

      return schedule;

    } catch (error) {
      console.error('Error in optimization cycle:', error);
      setState(prev => ({ ...prev, error: 'Optimization failed' }));
      return null;
    } finally {
      optimizingRef.current = false;
      setState(prev => ({ ...prev, isOptimizing: false }));
    }
  }, [fetchTrainData, analyzeConflicts, getOptimizedSchedule, saveSchedule]);

  // Start continuous optimization (same as Python decision_taker.py runContinuousOptimization)
  const startPolling = useCallback(() => {
    // Double-check global flag to absolutely prevent multiple instances
    if (globalOptimizationEngineActive) {
      console.log('Optimization engine already active globally, skipping start request');
      return;
    }

    if (intervalRef.current || isPollingRef.current) {
      console.log('Optimization engine already has active interval or polling ref, skipping start request');
      return;
    }

    console.log(`Starting continuous optimization with ${pollingInterval}ms polling interval`);
    globalOptimizationEngineActive = true;
    isPollingRef.current = true;
    setState(prev => ({ ...prev, isPolling: true }));

    // Run initial optimization
    optimizeTraffic();

    // Set up polling with protection against overlapping calls
    intervalRef.current = setInterval(async () => {
      // Additional check to ensure we don't run if already optimizing
      if (optimizingRef.current || !globalOptimizationEngineActive) {
        console.log('Previous optimization still running or engine stopped, skipping this cycle');
        return;
      }

      const startTime = Date.now();

      try {
        await optimizeTraffic();

        const elapsed = Date.now() - startTime;
        console.log(`Optimization cycle completed in ${elapsed}ms`);

      } catch (error) {
        console.error('Error in optimization cycle:', error);
      }
    }, pollingInterval);

  }, [pollingInterval, optimizeTraffic]);

  // Stop polling
  const stopPolling = useCallback(() => {
    console.log('Stopping continuous optimization');

    // Clear the interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Reset all flags
    globalOptimizationEngineActive = false;
    isPollingRef.current = false;
    optimizingRef.current = false;

    setState(prev => ({ ...prev, isPolling: false, isOptimizing: false }));
  }, []);

  // Manual refresh
  const refreshOptimization = useCallback(async () => {
    return await optimizeTraffic();
  }, [optimizeTraffic]);

  // Toggle Groq AI usage
  const toggleGroqAI = useCallback((enabled: boolean) => {
    setState(prev => ({ ...prev, useGroqAI: enabled && !!groqApiKey }));
    console.log(`Groq AI optimization ${enabled && groqApiKey ? 'enabled' : 'disabled'}`);
  }, [groqApiKey]);

  // Get saved schedules from local storage
  const getSavedSchedules = useCallback(() => {
    const schedules: Array<{key: string, schedule: OptimizationSchedule, timestamp: string}> = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('train_schedule_')) {
        try {
          const scheduleData = localStorage.getItem(key);
          if (scheduleData) {
            const schedule = JSON.parse(scheduleData);
            schedules.push({
              key,
              schedule,
              timestamp: new Date(schedule.now_epoch_s * 1000).toISOString()
            });
          }
        } catch (error) {
          console.warn(`Failed to parse saved schedule ${key}:`, error);
        }
      }
    }
    
    return schedules.sort((a, b) => b.schedule.now_epoch_s - a.schedule.now_epoch_s);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      optimizingRef.current = false;
    };
  }, []);

  return {
    ...state,
    startPolling,
    stopPolling,
    refreshOptimization,
    toggleGroqAI,
    getSavedSchedules,
    // Helper functions for components
    getActionIcon: (action: string) => {
      if (action === 'proceed') return '✅';
      if (action.includes('hold_until')) return '⏸️';
      if (action === 'reroute') return '🔄';
      return '🤖';
    },
    getActionColor: (action: string) => {
      if (action === 'proceed') return 'bg-green-100 text-green-800 border-green-300';
      if (action.includes('hold_until')) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      if (action === 'reroute') return 'bg-blue-100 text-blue-800 border-blue-300';
      return 'bg-gray-100 text-gray-800 border-gray-300';
    },
    getPriorityColor: (score: number) => {
      if (score >= 4.5) return 'text-green-600';
      if (score >= 3.5) return 'text-yellow-600';
      return 'text-red-600';
    },
    getConflictSeverityColor: (severity: string) => {
      if (severity === 'high') return 'text-red-600 bg-red-50';
      if (severity === 'medium') return 'text-yellow-600 bg-yellow-50';
      return 'text-gray-600 bg-gray-50';
    }
  };
};

export default useOptimizationEngine;