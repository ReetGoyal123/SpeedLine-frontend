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
        className={`absolute flex items-center space-x-2 transform -translate-y-1/2 bg-white border-2 px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${getTrainTypeColor(train.train.type)} border-current`}
        style={{ left: `${position}%` }}
        title={`${train.train.train_id} - ${train.train.type} - ${train.train.status} - Priority: ${train.train.priority}`}
      >
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-gray-800">{train.train.train_id}</span>
          <span className="text-sm text-gray-600">
            {train.train.direction === 'forward' ? '→' : '←'}
          </span>
        </div>
        <div className={`w-3 h-3 rounded-full shadow-sm ${getTrainStatusColor(train.train.status)}`} />
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Live Train Positions</h2>
        <div className="text-sm text-gray-500">Real-time tracking</div>
      </div>
      
      <div className="space-y-10">
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {section.id}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>{section.start}</span>
                    <span>→</span>
                    <span>{section.end}</span>
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                    {section.length} km • {section.trackType} track
                  </span>
                  {isDisrupted && showDisruptions && (
                    <span className="bg-red-50 text-red-700 text-sm px-3 py-1 rounded-lg border border-red-200 font-medium">
                      🚨 Disrupted
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">
                  Utilization: <span className="font-medium">{utilizationPercent}%</span>
                </div>
              </div>

              {/* Track Visual */}
              <div className="relative">
                {/* Track Line */}
                <div className={`relative h-12 bg-gray-100 rounded-xl border-2 ${
                  section.trackType === 'double' 
                    ? 'border-gray-300 bg-gradient-to-r from-gray-100 to-gray-200' 
                    : 'border-gray-300'
                } ${isDisrupted && showDisruptions ? 'bg-red-50 border-red-200' : ''} shadow-sm`}>
                  
                  {/* Track Rails */}
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-400 transform -translate-y-1/2 rounded-full"></div>
                  {section.trackType === 'double' && (
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-400 transform -translate-y-2 rounded-full opacity-60"></div>
                  )}
                  
                  {/* Station Markers */}
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md" />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md" />
                  
                  {/* Station Labels */}
                  <div className="absolute left-0 -top-8 text-sm font-semibold text-gray-700 bg-white px-2 py-1 rounded-lg shadow-sm">
                    {section.start}
                  </div>
                  <div className="absolute right-0 -top-8 text-sm font-semibold text-gray-700 bg-white px-2 py-1 rounded-lg shadow-sm">
                    {section.end}
                  </div>

                  {/* Trains */}
                  <div className="absolute inset-0">
                    {trains.map(train => renderTrain(train, section.length))}
                  </div>

                  {/* Speed Limit */}
                  <div className="absolute right-4 -bottom-8 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                    Max: {sectionData?.max_speed_kmh || 100} km/h
                  </div>
                </div>

                {/* Capacity Bar */}
                <div className="mt-4 h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${
                      utilizationPercent > 80 ? 'bg-red-500' :
                      utilizationPercent > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${utilizationPercent}%` }}
                  />
                </div>
              </div>

              {/* Train Details */}
              {trains.length > 0 && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trains.map(train => (
                    <div 
                      key={train.train.train_id}
                      className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-gray-900">{train.train.train_id}</span>
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium text-white ${getTrainTypeColor(train.train.type)}`}>
                          {train.train.type}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center justify-between">
                          <span>Status:</span>
                          <span className="font-medium">{train.train.status}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Priority:</span>
                          <span className="font-medium">{train.train.priority}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Speed:</span>
                          <span className="font-medium">{train.train.max_speed_kmh} km/h</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Destination:</span>
                          <span className="font-medium">{train.train.destination_station}</span>
                        </div>
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
      <div className="mt-10 p-6 bg-gray-50 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {trainData.length}
            </div>
            <div className="text-sm text-gray-600 font-medium">Active Trains</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {trainData.filter(t => t.train.status === 'On time').length}
            </div>
            <div className="text-sm text-gray-600 font-medium">On Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              {trainData.filter(t => t.train.status === 'Delayed').length}
            </div>
            <div className="text-sm text-gray-600 font-medium">Delayed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-1">
              {trainData.filter(t => t.section.is_disrupted).length}
            </div>
            <div className="text-sm text-gray-600 font-medium">In Disrupted Sections</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainVisualization;