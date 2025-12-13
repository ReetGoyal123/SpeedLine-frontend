'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Beaker,
  Play,
  Clock,
  AlertTriangle,
  RotateCcw,
  BarChart3,
  Info,
  Lightbulb,
  Train,
  Map,
  Calendar
} from 'lucide-react';

interface SimulationRequest {
  scenario_type: 'delay' | 'disruption' | 'maintenance' | 'weather';
  parameters: {
    train_id?: string;
    section_id?: string;
    duration_minutes: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
  };
  use_real_time_data: boolean;
}

interface SimulationResult {
  simulation_id: string;
  timestamp: string;
  input_data: {
    current_trains: number;
    active_sections: number;
    system_load: number;
    active_disruptions: number;
  };
  projected_impact: {
    affected_trains: Array<{
      train_id: string;
      current_position: string;
      projected_delay: number;
      alternative_routes: string[];
      passenger_count: number;
    }>;
    system_metrics: {
      total_delay_minutes: number;
      affected_passengers: number;
      revenue_impact: number;
      capacity_utilization: number;
      alternative_routes_needed: number;
    };
  };
  recommendations: Array<{
    action: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    estimated_benefit: string;
    implementation_time: number;
  }>;
}

interface SystemState {
  trains: Array<{
    train_id: string;
    type: string;
    current_section: string;
    status: string;
    destination: string;
  }>;
  sections: Array<{
    section_id: string;
    name: string;
    status: string;
    capacity: number;
    current_occupancy: number;
  }>;
  disruptions: any[];
  timestamp: string;
}

interface PredefinedScenario {
  id: string;
  name: string;
  type: string;
  description: string;
  parameters: {
    duration_minutes: number;
    severity: string;
    train_type?: string;
  };
}

const SimulationPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([]);
  const [systemState, setSystemState] = useState<SystemState | null>(null);
  const [predefinedScenarios, setPredefinedScenarios] = useState<PredefinedScenario[]>([]);
  const [selectedResult, setSelectedResult] = useState<SimulationResult | null>(null);
  
  // Custom scenario state
  const [customScenario, setCustomScenario] = useState<SimulationRequest>({
    scenario_type: 'delay',
    parameters: {
      duration_minutes: 30,
      severity: 'medium'
    },
    use_real_time_data: true
  });

  // Fetch system state and predefined scenarios on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current system state from real-time endpoint
        const stateResponse = await fetch('http://localhost:8000/api/simulation/system-state');
        if (stateResponse.ok) {
          const stateData = await stateResponse.json();
          setSystemState(stateData);
          console.log('Real-time system state loaded:', stateData);
        } else {
          console.warn('Failed to fetch system state:', stateResponse.status);
        }

        // Fetch dynamically generated scenarios
        const scenariosResponse = await fetch('http://localhost:8000/api/simulation/scenarios');
        if (scenariosResponse.ok) {
          const scenariosData = await scenariosResponse.json();
          setPredefinedScenarios(scenariosData.scenarios || []);
          console.log('Dynamic scenarios loaded:', scenariosData.scenarios?.length || 0);
        } else {
          console.warn('Failed to fetch scenarios:', scenariosResponse.status);
        }
      } catch (error) {
        console.error('Error fetching simulation data:', error);
        // Show user-friendly error message
        alert('Unable to load real-time simulation data. Please check if the backend server is running.');
      }
    };

    fetchData();
    
    // Refresh system state every 30 seconds to get latest real-time data
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Run simulation with enhanced error handling and loading states
  const runSimulation = async (scenarioRequest: SimulationRequest) => {
    setIsRunning(true);
    
    try {
      console.log('Running simulation with request:', scenarioRequest);
      
      const response = await fetch('http://localhost:8000/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scenarioRequest)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Simulation failed with status: ${response.status}`);
      }

      const result: SimulationResult = await response.json();
      
      console.log('Simulation completed successfully:', result.simulation_id);
      console.log('Affected trains:', result.projected_impact.affected_trains.length);
      console.log('Total delay:', result.projected_impact.system_metrics.total_delay_minutes, 'minutes');
      
      setSimulationResults(prev => [result, ...prev]);
      setSelectedResult(result);
      
      // Show success message
      const affectedCount = result.projected_impact.affected_trains.length;
      const totalDelay = Math.round(result.projected_impact.system_metrics.total_delay_minutes);
      alert(`Simulation completed! ${affectedCount} trains affected with ${totalDelay} minutes total delay.`);
      
    } catch (error) {
      console.error('Simulation error:', error);
      alert(`Simulation failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Run predefined scenario
  const runPredefinedScenario = (scenario: PredefinedScenario) => {
    const request: SimulationRequest = {
      scenario_type: scenario.type as any,
      parameters: {
        duration_minutes: scenario.parameters.duration_minutes,
        severity: scenario.parameters.severity as any,
      },
      use_real_time_data: true
    };

    runSimulation(request);
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get scenario type icon
  const getScenarioIcon = (type: string) => {
    switch (type) {
      case 'delay': return Clock;
      case 'disruption': return AlertTriangle;
      case 'maintenance': return Train;
      case 'weather': return Map;
      default: return Info;
    }
  };

  const availableTrains = systemState?.trains?.filter(train => train.status !== 'out_of_service') || [];
  const availableSections = systemState?.sections || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-80 h-80 bg-gradient-to-r from-indigo-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>
      
      {/* Navigation */}
      <nav className="relative z-10 bg-white/80 backdrop-blur-md shadow-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link href="/">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="relative">
                    <Train className="w-10 h-10 text-blue-600 drop-shadow-lg" />
                    <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-20 animate-pulse"></div>
                  </div>
                  SpeedLine
                </h1>
              </Link>
              <span className="ml-4 text-sm text-blue-700 font-medium px-4 py-2 bg-blue-100 rounded-full border border-blue-200">
                AI-Powered Railway Control
              </span>
            </div>
            <div className="flex space-x-3">
              <Link href="/dashboard">
                <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 backdrop-blur-sm shadow-md">
                  Dashboard
                </Button>
              </Link>
              <Link href="/health">
                <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-300 backdrop-blur-sm shadow-md">
                  System Health
                </Button>
              </Link>
              <Button variant="outline" className="bg-purple-50 border-purple-400 text-purple-800 hover:bg-purple-100 hover:border-purple-500 transition-all duration-300 backdrop-blur-sm shadow-md">
                Simulation
              </Button>
              <Link href="/optimization-engine">
                <Button variant="outline" className="border-indigo-300 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-300 backdrop-blur-sm shadow-md">
                  Live Engine
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 py-6">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-2xl mb-6 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Beaker className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">What-If Simulation</h1>
                <p className="text-gray-600">
                  Analyze the impact of various scenarios on your train network using real-time data
                </p>
              </div>
            </div>

            {/* Current System Status */}
            {systemState && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-blue-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">{availableTrains.length}</div>
                  <div className="text-sm text-gray-600">Active Trains</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Real-time • {new Date(systemState.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <div className="bg-white border border-green-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">{availableSections.length}</div>
                  <div className="text-sm text-gray-600">Operational Sections</div>
                  <div className="text-xs text-gray-500 mt-1">Live status</div>
                </div>
                <div className="bg-white border border-red-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-red-600">{systemState.disruptions?.length || 0}</div>
                  <div className="text-sm text-gray-600">Active Disruptions</div>
                  <div className="text-xs text-gray-500 mt-1">Current incidents</div>
                </div>
                <div className="bg-white border border-orange-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-600">{simulationResults.length}</div>
                  <div className="text-sm text-gray-600">Simulations Run</div>
                  <div className="text-xs text-gray-500 mt-1">This session</div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Predefined Scenarios */}
            <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Quick Scenarios
              </h2>
              
              <div className="space-y-3">
                {predefinedScenarios.map((scenario) => {
                  const IconComponent = getScenarioIcon(scenario.type);
                  return (
                    <motion.div
                      key={scenario.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-purple-300 transition-colors"
                      onClick={() => runPredefinedScenario(scenario)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <IconComponent className="w-4 h-4 text-purple-600" />
                            <h3 className="font-semibold text-gray-900 text-sm">{scenario.name}</h3>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{scenario.description}</p>
                          
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(scenario.parameters.severity)}`}>
                              {scenario.parameters.severity}
                            </span>
                            <span className="text-xs text-gray-500">
                              {scenario.parameters.duration_minutes}min
                            </span>
                          </div>
                        </div>
                        
                        <button
                          disabled={isRunning}
                          className="ml-2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                          <Play className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Custom Scenario Builder */}
            <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Beaker className="w-5 h-5" />
                Custom Scenario
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scenario Type
                  </label>
                  <select
                    value={customScenario.scenario_type}
                    onChange={(e) => setCustomScenario(prev => ({
                      ...prev,
                      scenario_type: e.target.value as any
                    }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="delay">Train Delay</option>
                    <option value="disruption">Track Disruption</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="weather">Weather Impact</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Train (Optional)
                  </label>
                  <select
                    value={customScenario.parameters.train_id || ''}
                    onChange={(e) => setCustomScenario(prev => ({
                      ...prev,
                      parameters: { ...prev.parameters, train_id: e.target.value || undefined }
                    }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Any train</option>
                    {availableTrains.map(train => (
                      <option key={train.train_id} value={train.train_id}>
                        {train.train_id} ({train.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Section (Optional)
                  </label>
                  <select
                    value={customScenario.parameters.section_id || ''}
                    onChange={(e) => setCustomScenario(prev => ({
                      ...prev,
                      parameters: { ...prev.parameters, section_id: e.target.value || undefined }
                    }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Any section</option>
                    {availableSections.map(section => (
                      <option key={section.section_id} value={section.section_id}>
                        {section.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (min)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="480"
                      value={customScenario.parameters.duration_minutes}
                      onChange={(e) => setCustomScenario(prev => ({
                        ...prev,
                        parameters: { ...prev.parameters, duration_minutes: Number(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Severity
                    </label>
                    <select
                      value={customScenario.parameters.severity}
                      onChange={(e) => setCustomScenario(prev => ({
                        ...prev,
                        parameters: { ...prev.parameters, severity: e.target.value as any }
                      }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => runSimulation(customScenario)}
                  disabled={isRunning || !systemState}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {isRunning ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      Running Simulation...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Run Simulation
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results Panel */}
            <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Results ({simulationResults.length})
              </h2>
              
              {simulationResults.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Beaker className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">No simulations run yet</p>
                  <p className="text-xs">Run a scenario to see impact analysis</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {simulationResults.map((result) => (
                    <motion.div
                      key={result.simulation_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedResult?.simulation_id === result.simulation_id
                          ? 'border-purple-300 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedResult(result)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          Simulation {result.simulation_id.split('_')[1]}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                        <div>
                          <span className="text-gray-600">Affected:</span>
                          <span className="font-semibold ml-1">{result.projected_impact.affected_trains.length}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Delay:</span>
                          <span className="font-semibold ml-1">{Math.round(result.projected_impact.system_metrics.total_delay_minutes)}min</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Passengers:</span>
                          <span className="font-semibold ml-1">{result.projected_impact.system_metrics.affected_passengers}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Cost:</span>
                          <span className="font-semibold ml-1">${Math.round(result.projected_impact.system_metrics.revenue_impact)}</span>
                        </div>
                      </div>

                      <div className="text-xs">
                        <p className="text-gray-600 mb-1">Top Action:</p>
                        <p className="text-gray-800 truncate">{result.recommendations[0]?.action}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Detailed Results Modal */}
          <AnimatePresence>
            {selectedResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedResult(null)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Simulation Results - {selectedResult.simulation_id}
                    </h2>
                    <button
                      onClick={() => setSelectedResult(null)}
                      className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* System Impact */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">System Impact</h3>
                      <div className="space-y-3">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <div className="text-lg font-bold text-red-600">
                            {Math.round(selectedResult.projected_impact.system_metrics.total_delay_minutes)} minutes
                          </div>
                          <div className="text-sm text-red-700">Total System Delay</div>
                        </div>
                        
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                          <div className="text-lg font-bold text-orange-600">
                            {selectedResult.projected_impact.system_metrics.affected_passengers.toLocaleString()}
                          </div>
                          <div className="text-sm text-orange-700">Affected Passengers</div>
                        </div>
                        
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="text-lg font-bold text-green-600">
                            ${Math.round(selectedResult.projected_impact.system_metrics.revenue_impact).toLocaleString()}
                          </div>
                          <div className="text-sm text-green-700">Estimated Revenue Impact</div>
                        </div>
                      </div>
                    </div>

                    {/* Affected Trains */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Affected Trains</h3>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {selectedResult.projected_impact.affected_trains.map((train, index) => (
                          <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-semibold text-blue-800">{train.train_id}</span>
                              <span className="text-sm text-blue-600">+{Math.round(train.projected_delay)} min</span>
                            </div>
                            <div className="text-xs text-blue-700 mt-1">
                              Position: {train.current_position} • 
                              Passengers: {train.passenger_count}
                            </div>
                            {train.alternative_routes.length > 0 && (
                              <div className="text-xs text-blue-600 mt-1">
                                Alt routes: {train.alternative_routes.join(', ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      Recommendations
                    </h3>
                    <div className="space-y-3">
                      {selectedResult.recommendations.map((rec, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{rec.action}</h4>
                              <p className="text-sm text-gray-600 mt-1">{rec.estimated_benefit}</p>
                            </div>
                            <div className="text-right ml-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(rec.priority)}`}>
                                {rec.priority}
                              </span>
                              <div className="text-xs text-gray-500 mt-1">
                                {rec.implementation_time} min to implement
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SimulationPage;