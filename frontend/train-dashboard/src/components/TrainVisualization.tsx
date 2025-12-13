'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { TrainBundle } from '@/types';

// Define comprehensive interfaces
interface TrainData {
  train_id: string;
  type: string;
  current_location?: {
    section_id: string;
    position_m: number;
  };
  status: string;
  destination_station: string;
  max_speed_kmh?: number;
  priority?: number;
  actual_departure?: string | null;
  actual_arrival?: string | null;
  direction?: string;
  restricted_speed?: boolean;
  breakdown_until?: string | null;
  journey_count?: number;
  length_m?: number;
}

interface SectionData {
  section_id: string;
  start_station: string;
  end_station: string;
  length_km: number;
  capacity: number;
  max_speed_kmh: number;
  track_type: string;
  is_disrupted?: boolean;
  occupancy_count?: number;
}

// Simplified tooltip interface for performance
interface SimpleTooltipProps {
  train: TrainData;
  position: { x: number; y: number };
  isVisible: boolean;
}

const SimpleTrainTooltip: React.FC<SimpleTooltipProps> = ({ train, position, isVisible }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isVisible || !mounted) return null;

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase().replace(/[-_\s]/g, '');
    switch (statusLower) {
      case 'ontime': return 'bg-green-500 text-white';
      case 'delayed': return 'bg-red-500 text-white';
      case 'arrived': return 'bg-blue-500 text-white';
      case 'cancelled': return 'bg-gray-500 text-white';
      case 'waitingtraffic': return 'bg-orange-500 text-white';
      case 'waitingsectiondisrupted': return 'bg-red-500 text-white';
      case 'waitingnoroute': return 'bg-purple-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Simplified positioning - tooltip appears above train
  const tooltipWidth = 280;
  const tooltipHeight = 160;
  const margin = 10;
  
  // Always try to show above first, then adjust if needed
  let tooltipX = position.x - tooltipWidth / 2;
  let tooltipY = position.y - tooltipHeight - margin;
  
  // Adjust horizontal position if near viewport edge
  if (tooltipX < margin) {
    tooltipX = margin;
  } else if (tooltipX + tooltipWidth > window.innerWidth - margin) {
    tooltipX = window.innerWidth - tooltipWidth - margin;
  }
  
  // If tooltip would go above viewport, show below instead
  if (tooltipY < margin) {
    tooltipY = position.y + margin;
  }

  const tooltipContent = (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed z-[10000] bg-white rounded-lg shadow-2xl border border-gray-300 pointer-events-none"
      style={{
        left: tooltipX,
        top: tooltipY,
        width: tooltipWidth,
      }}
    >
      {/* Header with train info */}
      <div className={`px-4 py-2 rounded-t-lg ${getStatusColor(train.status)}`}>
        <div className="flex items-center justify-between">
          <div className="font-bold text-lg">{train.train_id}</div>
          <div className="text-sm opacity-90">{train.type}</div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Current Section:</span>
          <span className="font-medium text-sm">{train.current_location?.section_id || 'Unknown'}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Destination:</span>
          <span className="font-medium text-sm">{train.destination_station}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Status:</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(train.status)}`}>
            {train.status.replace(/[-_]/g, ' ').toUpperCase()}
          </span>
        </div>
        
        {train.max_speed_kmh && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Max Speed:</span>
            <span className="font-medium text-sm">{train.max_speed_kmh} km/h</span>
          </div>
        )}
      </div>
      
      {/* Tooltip arrow */}
      <div 
        className="absolute w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"
        style={{
          bottom: '-4px',
          left: Math.min(Math.max(position.x - tooltipX, 20), tooltipWidth - 20),
        }}
      />
    </motion.div>
  );

  return createPortal(tooltipContent, document.body);
};

interface TrainMarkerProps {
  train: TrainData;
  section: SectionData;
  position: number;
  verticalOffset: number;
}

const TrainMarker: React.FC<TrainMarkerProps> = ({ train, section, position, verticalOffset }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseEnter = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    setMousePosition({
      x: rect.left + scrollLeft + (rect.width / 2),
      y: rect.top + scrollTop
    });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const getTrainColor = (status: string) => {
    const statusLower = status.toLowerCase().replace(/[-_\s]/g, '');
    switch (statusLower) {
      case 'ontime': return 'bg-green-500 border-green-600 shadow-green-200';
      case 'delayed': return 'bg-red-500 border-red-600 shadow-red-200';
      case 'arrived': return 'bg-blue-500 border-blue-600 shadow-blue-200';
      case 'cancelled': return 'bg-gray-500 border-gray-600 shadow-gray-200';
      case 'waitingtraffic': return 'bg-orange-500 border-orange-600 shadow-orange-200';
      case 'waitingsectiondisrupted': return 'bg-red-500 border-red-600 shadow-red-200';
      case 'waitingnoroute': return 'bg-purple-500 border-purple-600 shadow-purple-200';
      default: return 'bg-gray-500 border-gray-600 shadow-gray-200';
    }
  };

  return (
    <>
      <motion.div
        className="absolute cursor-pointer transition-all duration-200 hover:scale-110"
        style={{
          left: `${Math.max(2, Math.min(98, position))}%`,
          top: `calc(50% + ${verticalOffset}px)`,
          transform: 'translate(-50%, -50%)',
          zIndex: showTooltip ? 30 : 10,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        whileHover={{ scale: 1.15 }}
      >
        {/* Train Icon */}
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${getTrainColor(train.status)} shadow-lg`}>
          <div className="text-white text-xs font-bold">🚆</div>
        </div>
        
        {/* Train ID Label */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-1 py-0.5 bg-gray-900 text-white text-xs rounded font-mono whitespace-nowrap">
          {train.train_id}
        </div>

        {/* Status Indicators */}
        {train.restricted_speed && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full border border-white animate-pulse" />
        )}
        {train.breakdown_until && (
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-600 rounded-full border border-white animate-pulse" />
        )}
      </motion.div>

      {/* Simplified Tooltip */}
      <AnimatePresence>
        {showTooltip && mounted && (
          <SimpleTrainTooltip
            train={train}
            position={mousePosition}
            isVisible={showTooltip}
          />
        )}
      </AnimatePresence>
    </>
  );
};

interface TrainSectionProps {
  section: SectionData;
  trains: TrainData[];
}

const TrainSection: React.FC<TrainSectionProps> = React.memo(({ section, trains }) => {
  // Improved vertical staggering algorithm
  const getVerticalOffset = useMemo(() => {
    return (index: number, total: number, position: number) => {
      if (total === 1) return 0;
      
      // Base vertical spread based on number of trains
      const baseSpread = Math.min(40, total * 8); // Maximum 40px spread
      const stepSize = total > 1 ? (baseSpread * 2) / (total - 1) : 0;
      
      // Calculate base offset
      let baseOffset = (index * stepSize) - baseSpread;
      
      // Add slight position-based variation to avoid perfect alignment
      const positionVariation = (position % 20) - 10; // Small variation based on track position
      
      return baseOffset + (positionVariation * 0.3);
    };
  }, []);

  // Sort trains by position for consistent layering
  const sortedTrains = useMemo(() => {
    return [...trains].sort((a, b) => {
      const posA = a.current_location?.position_m || 0;
      const posB = b.current_location?.position_m || 0;
      return posA - posB;
    });
  }, [trains]);

  // Calculate train position percentage along track
  const getTrainPosition = useMemo(() => {
    return (train: TrainData) => {
      if (!train.current_location) return 10;
      const sectionLengthM = section.length_km * 1000;
      const progress = (train.current_location.position_m / sectionLengthM) * 80;
      return Math.max(5, Math.min(95, progress + 10));
    };
  }, [section.length_km]);

  const getSectionStatusColor = () => {
    if (section.is_disrupted) return 'bg-red-100 border-red-300';
    if ((section.occupancy_count || 0) >= section.capacity) return 'bg-orange-100 border-orange-300';
    return 'bg-white border-gray-200';
  };

  return (
    <div className={`relative mb-6 p-4 rounded-xl border shadow-lg transition-all duration-300 ${getSectionStatusColor()}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900">{section.section_id}</h3>
          <p className="text-sm text-gray-600">{section.start_station} → {section.end_station}</p>
          <p className="text-xs text-gray-500">
            {section.length_km} km • {section.track_type} • Max {section.max_speed_kmh} km/h
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
            section.is_disrupted ? 'bg-red-100 text-red-800' :
            (section.occupancy_count || 0) >= section.capacity ? 'bg-orange-100 text-orange-800' :
            'bg-green-100 text-green-800'
          }`}>
            {section.is_disrupted ? 'Disrupted' : 'Operational'}
          </div>
          <div className="text-sm text-gray-500">
            {Math.round(((section.occupancy_count || 0) / section.capacity) * 100)}%
          </div>
        </div>
      </div>

      {/* Track Visualization - Optimized */}
      <div className="relative h-16 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded-lg overflow-visible border border-gray-200">
        {/* Track Lines */}
        <div className="absolute inset-0 flex items-center px-4">
          <div className={`w-full h-1.5 rounded ${section.is_disrupted ? 'bg-red-400' : 'bg-gray-400'}`} />
          
          {/* Station markers */}
          <div className="absolute left-4 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-md" />
          <div className="absolute right-4 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-md" />
          
          {/* Double track indicator */}
          {section.track_type === 'double' && (
            <div className={`absolute inset-x-4 top-5 h-0.5 rounded ${section.is_disrupted ? 'bg-red-300' : 'bg-gray-300'}`} />
          )}
        </div>

        {/* Station Labels */}
        <div className="absolute left-2 -bottom-5 text-xs font-semibold text-blue-700 bg-white px-1 rounded">
          {section.start_station}
        </div>
        <div className="absolute right-2 -bottom-5 text-xs font-semibold text-blue-700 bg-white px-1 rounded">
          {section.end_station}
        </div>

        {/* Train Markers with Dynamic Staggering */}
        {sortedTrains.map((train, index) => {
          const position = getTrainPosition(train);
          return (
            <TrainMarker
              key={train.train_id}
              train={train}
              section={section}
              position={position}
              verticalOffset={getVerticalOffset(index, sortedTrains.length, position)}
            />
          );
        })}
      </div>

      {/* Section Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 text-sm text-gray-600">
        <span>{trains.length} train{trains.length !== 1 ? 's' : ''}</span>
        <span>Capacity: {section.occupancy_count || 0}/{section.capacity}</span>
      </div>
    </div>
  );
});

interface TrainVisualizationProps {
  trainData: TrainBundle[];
  showDisruptions?: boolean;
}

const TrainVisualization: React.FC<TrainVisualizationProps> = ({ 
  trainData, 
  showDisruptions = true 
}) => {
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Update timestamp when data changes
  useEffect(() => {
    setLastUpdate(new Date().toISOString());
  }, [trainData]);

  // Memoized section grouping for performance
  const trainsBySection = useMemo(() => {
    const grouped: { [sectionId: string]: { section: SectionData; trains: TrainData[] } } = {};
    
    trainData.forEach(bundle => {
      const sectionId = bundle.section.section_id;
      if (!grouped[sectionId]) {
        grouped[sectionId] = {
          section: bundle.section,
          trains: []
        };
      }
      grouped[sectionId].trains.push(bundle.train);
    });
    
    return grouped;
  }, [trainData]);

  // Memoized statistics for better performance
  const stats = useMemo(() => {
    const totalTrains = trainData.length;
    const onTimeTrains = trainData.filter(t => t.train.status.toLowerCase().includes('time')).length;
    const delayedTrains = trainData.filter(t => t.train.status.toLowerCase().includes('delayed')).length;
    const disruptedSections = trainData.filter(t => t.section.is_disrupted).length;
    
    return { totalTrains, onTimeTrains, delayedTrains, disruptedSections };
  }, [trainData]);

  if (trainData.length === 0) {
    return (
      <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg">
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg">No train data available</div>
          <div className="text-gray-400 text-sm">Check if the backend server is running</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Live Train Positions</h2>
          <p className="text-sm text-gray-600">Real-time tracking with interactive details</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-green-600">● Live</div>
          {lastUpdate && (
            <div className="text-xs text-gray-500">
              Updated: {new Date(lastUpdate).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: false 
              })}
            </div>
          )}
        </div>
      </div>

      {/* Train Sections */}
      <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
        {Object.entries(trainsBySection).map(([sectionId, { section, trains }]) => (
          <TrainSection
            key={sectionId}
            section={section}
            trains={trains}
          />
        ))}
      </div>

      {/* Simplified Legend */}
      <div className="mt-6 p-4 bg-white/80 rounded-lg border">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-800">System Overview</h4>
          <div className="text-xs text-gray-600">💡 Hover over trains for details</div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-blue-600">{stats.totalTrains}</div>
            <div className="text-xs text-gray-600">Active Trains</div>
          </div>
          <div>
            <div className="text-xl font-bold text-green-600">{stats.onTimeTrains}</div>
            <div className="text-xs text-gray-600">On Time</div>
          </div>
          <div>
            <div className="text-xl font-bold text-yellow-600">{stats.delayedTrains}</div>
            <div className="text-xs text-gray-600">Delayed</div>
          </div>
          <div>
            <div className="text-xl font-bold text-red-600">{stats.disruptedSections}</div>
            <div className="text-xs text-gray-600">Disruptions</div>
          </div>
        </div>

        {/* Status Legend */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span>On Time</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span>Delayed/Issue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full" />
              <span>Waiting</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span>Arrived</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainVisualization;