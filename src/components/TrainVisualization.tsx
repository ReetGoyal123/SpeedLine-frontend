import React from 'react';
import { TrainBundle } from '@/types';
import { getTrainTypeColor, calculatePosition } from '@/lib/utils';

interface TrainVisualizationProps {
  trainData: TrainBundle[];
  showDisruptions?: boolean;
}

const TrainVisualization: React.FC<TrainVisualizationProps> = ({ 
  trainData, 
  showDisruptions = true 
}) => {
  const sections = [
    { id: 'SEC_1', start: 'STN_A', end: 'STN_B', length: 8.5, trackType: 'double' },
    { id: 'SEC_2', start: 'STN_B', end: 'STN_C', length: 6.2, trackType: 'single' },
    { id: 'SEC_3', start: 'STN_C', end: 'STN_D', length: 7.8, trackType: 'double' },
    { id: 'SEC_4', start: 'STN_D', end: 'STN_E', length: 5.3, trackType: 'single' },
    { id: 'SEC_5', start: 'STN_E', end: 'STN_F', length: 9.1, trackType: 'double' },
    { id: 'SEC_6', start: 'STN_B', end: 'STN_E', length: 12.0, trackType: 'single' },
  ];

  const getTrainsInSection = (sectionId: string) => {
    return trainData.filter(bundle => 
      bundle.train.current_location.section_id === sectionId
    );
  };

  const getTrainStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'on time':
        return 'bg-green-500';
      case 'delayed':
        return 'bg-yellow-500';
      case 'waiting':
        return 'bg-orange-500';
      case 'arrived':
        return 'bg-blue-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const renderTrain = (train: TrainBundle, sectionLength: number) => {
    const position = calculatePosition(
      train.train.current_location.position_m, 
      sectionLength
    );
    
    return (
      <div
        key={train.train.train_id}
        className={`absolute flex items-center space-x-1 transform -translate-y-1/2 ${getTrainTypeColor(train.train.type)} px-2 py-1 rounded text-xs font-medium shadow-sm`}
        style={{ left: `${position}%` }}
        title={`${train.train.train_id} - ${train.train.type} - ${train.train.status} - Priority: ${train.train.priority}`}
      >
        <span>{train.train.train_id}</span>
        <span className="text-xs">
          {train.train.direction === 'forward' ? '→' : '←'}
        </span>
        <div className={`w-2 h-2 rounded-full ${getTrainStatusColor(train.train.status)}`} />
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-6">Live Train Positions</h2>
      
      <div className="space-y-8">
        {sections.map((section) => {
          const trains = getTrainsInSection(section.id);
          const sectionData = trainData.find(bundle => 
            bundle.section.section_id === section.id
          )?.section;
          
          const isDisrupted = sectionData?.is_disrupted || false;
          const utilizationPercent = sectionData 
            ? Math.round((sectionData.occupancy_count / sectionData.capacity) * 100)
            : 0;

          return (
            <div key={section.id} className="relative">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h3 className="font-medium text-gray-900">
                    {section.id}: {section.start} → {section.end}
                  </h3>
                  <span className="text-sm text-gray-500">
                    ({section.length} km, {section.trackType} track)
                  </span>
                  {isDisrupted && showDisruptions && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded border border-red-300">
                      🚨 Disrupted
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Utilization: {utilizationPercent}%
                </div>
              </div>

              {/* Track Visual */}
              <div className="relative">
                {/* Track Line */}
                <div className={`relative h-8 bg-gray-200 rounded ${
                  section.trackType === 'double' 
                    ? 'border-t-2 border-b-2 border-gray-400' 
                    : 'border-t-2 border-gray-400'
                } ${isDisrupted && showDisruptions ? 'bg-red-100' : ''}`}>
                  
                  {/* Station Markers */}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-sm" />
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-sm" />
                  
                  {/* Station Labels */}
                  <div className="absolute -left-2 -top-6 text-xs font-medium text-gray-700">
                    {section.start}
                  </div>
                  <div className="absolute -right-2 -top-6 text-xs font-medium text-gray-700">
                    {section.end}
                  </div>

                  {/* Trains */}
                  <div className="absolute inset-0">
                    {trains.map(train => renderTrain(train, section.length))}
                  </div>

                  {/* Speed Limit */}
                  <div className="absolute right-4 -bottom-6 text-xs text-gray-500">
                    Max: {sectionData?.max_speed_kmh || 100} km/h
                  </div>
                </div>

                {/* Capacity Bar */}
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      utilizationPercent > 80 ? 'bg-red-500' :
                      utilizationPercent > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${utilizationPercent}%` }}
                  />
                </div>
              </div>

              {/* Train Details */}
              {trains.length > 0 && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {trains.map(train => (
                    <div 
                      key={train.train.train_id}
                      className="text-xs bg-gray-50 p-2 rounded border"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{train.train.train_id}</span>
                        <span className={`px-1 py-0.5 rounded text-white ${getTrainTypeColor(train.train.type)}`}>
                          {train.train.type}
                        </span>
                      </div>
                      <div className="mt-1 text-gray-600">
                        Status: {train.train.status}
                      </div>
                      <div className="text-gray-600">
                        Priority: {train.train.priority} | Speed: {train.train.max_speed_kmh} km/h
                      </div>
                      <div className="text-gray-600">
                        Destination: {train.train.destination_station}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {trainData.length}
            </div>
            <div className="text-sm text-gray-600">Active Trains</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {trainData.filter(t => t.train.status === 'On time').length}
            </div>
            <div className="text-sm text-gray-600">On Time</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {trainData.filter(t => t.train.status === 'Delayed').length}
            </div>
            <div className="text-sm text-gray-600">Delayed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {trainData.filter(t => t.section.is_disrupted).length}
            </div>
            <div className="text-sm text-gray-600">In Disrupted Sections</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainVisualization;