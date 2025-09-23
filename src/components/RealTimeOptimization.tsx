'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useOptimizationEngine from '@/hooks/useOptimizationEngine';
import { Play, Square, RotateCcw, AlertTriangle, Bot, Clock, Train, 
         CheckCircle, XCircle, Zap, Activity, Settings } from 'lucide-react';

interface RealTimeOptimizationProps {
  apiBaseUrl?: string;
  pollingInterval?: number;
  autoStart?: boolean;
}

const RealTimeOptimization: React.FC<RealTimeOptimizationProps> = ({
  apiBaseUrl = 'http://localhost:8000',
  pollingInterval = 20000, // 20 seconds like Python decision_taker.py
  autoStart = true
}) => {
  const {
    currentTrains,
    conflicts,
    optimizationResults,
    isOptimizing,
    lastOptimized,
    error,
    isPolling,
    startPolling,
    stopPolling,
    refreshOptimization,
    getActionIcon,
    getActionColor,
    getPriorityColor
  } = useOptimizationEngine(apiBaseUrl, pollingInterval, undefined, autoStart);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      console.log('RealTimeOptimization: Component unmounting, stopping optimization engine');
      stopPolling();
    };
  }, [stopPolling]);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getConflictSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const activeTrains = currentTrains.filter(train => 
    !['Arrived', 'Cancelled'].includes(train.train.status)
  );

  const scheduleEntries = Object.entries(optimizationResults?.schedule || {});

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Real-time Traffic Optimization Engine</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Continuous AI-powered train traffic optimization using Groq LLaMA 3.3
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {/* Live Status Indicator */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  isPolling ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`} />
                <span className="text-sm font-medium">
                  {isPolling ? 'LIVE' : 'STOPPED'}
                </span>
              </div>

              {/* Control Buttons */}
              <Button 
                variant={isPolling ? "destructive" : "default"}
                size="sm"
                onClick={isPolling ? stopPolling : startPolling}
                disabled={isOptimizing}
                className="flex items-center gap-2"
              >
                {isPolling ? (
                  <>
                    <Square className="w-4 h-4" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Start
                  </>
                )}
              </Button>

              <Button 
                variant="outline" 
                size="sm"
                onClick={refreshOptimization}
                disabled={isOptimizing}
                className="flex items-center gap-2"
              >
                <RotateCcw className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : ''}`} />
                {isOptimizing ? 'Optimizing...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{activeTrains.length}</div>
              <div className="text-sm text-gray-600">Active Trains</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{conflicts.length}</div>
              <div className="text-sm text-gray-600">Active Conflicts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{scheduleEntries.length}</div>
              <div className="text-sm text-gray-600">Scheduled Trains</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Last Optimized</div>
              <div className="text-xs font-medium">
                {lastOptimized ? lastOptimized.toLocaleTimeString() : 'Never'}
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-800 text-sm">{error}</span>
              </div>
            </div>
          )}

          {isOptimizing && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-blue-800 text-sm">Optimizing traffic using AI...</span>
              </div>
            </div>
          )}

          {/* Polling Status */}
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Polling every {pollingInterval / 1000} seconds from {apiBaseUrl}
              </span>
              <span className="text-gray-500">
                Next update in ~{Math.ceil(pollingInterval / 1000)}s
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Conflicts */}
      {conflicts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Active Conflicts ({conflicts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conflicts.map((conflict, index) => (
                <div key={index} className={`p-3 rounded-lg border ${getConflictSeverityColor(conflict.severity)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">
                        {conflict.type.replace('_', ' ').toUpperCase()} at {conflict.section}
                      </span>
                      <div className="text-sm mt-1">
                        {conflict.current_trains && (
                          <span>Occupied by: {conflict.current_trains.join(', ')}</span>
                        )}
                        {conflict.approaching && (
                          <span>Approaching: {conflict.approaching.join(', ')}</span>
                        )}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getConflictSeverityColor(conflict.severity)}`}>
                      {conflict.severity.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimization Results */}
      {optimizationResults && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-600" />
              AI Optimization Results
            </CardTitle>
            <div className="text-sm text-gray-600">
              Generated at: {formatTimestamp(optimizationResults.now_epoch_s)} | 
              Horizon: {optimizationResults.horizon_s}s | 
              Trains considered: {optimizationResults.snapshot_trains_considered}
            </div>
          </CardHeader>
          <CardContent>
            {scheduleEntries.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <Bot className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-gray-500">No optimization schedule generated</p>
              </div>
            ) : (
              <div className="space-y-4">
                {scheduleEntries.map(([trainId, schedule]) => (
                  <div key={trainId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{getActionIcon(schedule.action)}</span>
                        <div>
                          <h4 className="font-medium">{trainId}</h4>
                          <p className="text-sm text-gray-600">
                            Priority: {schedule.priority} | Status: {schedule.status}
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-lg border text-sm font-medium ${getActionColor(schedule.action)}`}>
                        {schedule.action.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Target Section:</span>
                        <div className="font-medium">{schedule.target_section}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Entry Time:</span>
                        <div className="font-medium">
                          {formatTimestamp(schedule.entry_epoch_s)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Offset:</span>
                        <div className="font-medium">{schedule.entry_offset_s}s</div>
                      </div>
                    </div>

                    {schedule.action.includes('hold_until') && (
                      <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <span className="text-yellow-800 text-sm flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Hold until: {schedule.action.split('hold_until_')[1]}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Current Train Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Train className="w-5 h-5 text-blue-600" />
            Current Train Status ({activeTrains.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTrains.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Train className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No active trains</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeTrains.map((train, index) => (
                <div key={train.train.train_id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{train.train.train_id}</span>
                      <span className="ml-2 text-sm text-gray-600">
                        {train.train.type} (Priority: {train.train.priority})
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      train.train.status === 'On time' ? 'bg-green-100 text-green-800' :
                      train.train.status === 'Delayed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {train.train.status}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span>Section: {train.train.current_location?.section_id || 'Unknown'}</span>
                    <span className="ml-4">Position: {train.train.current_location?.position_m || 0}m</span>
                    <span className="ml-4">Speed: {train.train.max_speed_kmh}km/h</span>
                    <span className="ml-4">→ {train.train.destination_station}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeOptimization;