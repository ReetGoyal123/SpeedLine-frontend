'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useDisruptions from '@/hooks/useDisruptions';
import { getDisruptionSeverityColor } from '@/lib/utils';

export default function DisruptionsPage() {
  const { disruptions, isLoading } = useDisruptions();

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      case 'low': return '💛';
      default: return 'ℹ️';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'signal_failure': return '🚦';
      case 'maintenance': return '🔧';
      case 'track_work': return '🛠️';
      case 'emergency': return '🚨';
      default: return '⚠️';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/">
                <h1 className="text-2xl font-bold text-gray-900 cursor-pointer">
                  🚄 SpeedLine
                </h1>
              </Link>
              <div className="flex space-x-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
                <Button variant="default" size="sm">Disruptions</Button>
                <Link href="/optimization">
                  <Button variant="ghost" size="sm">AI Optimization</Button>
                </Link>
                <Link href="/optimization-engine">
                  <Button variant="ghost" size="sm">Live Engine</Button>
                </Link>
                <Link href="/health">
                  <Button variant="ghost" size="sm">System Health</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Service Disruptions</h1>
          <p className="mt-2 text-gray-600">
            Current service disruptions and their impact on train operations
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading disruption data...</p>
          </div>
        )}

        {/* Disruptions Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Disruptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{disruptions.length}</div>
              <p className="text-xs text-gray-500 mt-1">Active incidents</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                High Severity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {disruptions.filter(d => d.severity === 'high').length}
              </div>
              <p className="text-xs text-gray-500 mt-1">Requiring immediate attention</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Affected Trains
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {disruptions.reduce((sum, d) => sum + d.affected_trains.length, 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Currently impacted</p>
            </CardContent>
          </Card>
        </div>

        {/* Disruptions List */}
        <div className="space-y-6">
          {disruptions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Active Disruptions
                </h3>
                <p className="text-gray-500">
                  All sections are operating normally
                </p>
              </CardContent>
            </Card>
          ) : (
            disruptions.map((disruption) => (
              <Card key={disruption.section_id} className="overflow-hidden">
                <CardHeader className={`${getDisruptionSeverityColor(disruption.severity)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {getSeverityIcon(disruption.severity)}
                      </span>
                      <div>
                        <CardTitle className="text-lg">
                          Section {disruption.section_id} - {disruption.type.replace('_', ' ').toUpperCase()}
                        </CardTitle>
                        <p className="text-sm opacity-75 mt-1">
                          Severity: {disruption.severity.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <span className="text-3xl">
                      {getTypeIcon(disruption.type)}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Disruption Details */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Details</h4>
                      <p className="text-gray-700 mb-4">{disruption.description}</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Started:</span>
                          <span className="font-medium">
                            {new Date(disruption.start_time).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Est. Resolution:</span>
                          <span className="font-medium">
                            {new Date(disruption.estimated_end_time).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">
                            {Math.round(
                              (new Date(disruption.estimated_end_time).getTime() - 
                               new Date(disruption.start_time).getTime()) / (1000 * 60)
                            )} minutes
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Affected Trains */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Affected Trains ({disruption.affected_trains.length})
                      </h4>
                      {disruption.affected_trains.length === 0 ? (
                        <p className="text-gray-500 text-sm">No trains currently affected</p>
                      ) : (
                        <div className="space-y-2">
                          {disruption.affected_trains.map((trainId) => (
                            <div 
                              key={trainId}
                              className="flex items-center justify-between bg-gray-50 p-2 rounded"
                            >
                              <span className="font-medium text-sm">{trainId}</span>
                              <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                                Delayed
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Resolution Progress</span>
                      <span>
                        {Math.min(100, Math.round(
                          (Date.now() - new Date(disruption.start_time).getTime()) /
                          (new Date(disruption.estimated_end_time).getTime() - new Date(disruption.start_time).getTime()) * 100
                        ))}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(100, Math.round(
                            (Date.now() - new Date(disruption.start_time).getTime()) /
                            (new Date(disruption.estimated_end_time).getTime() - new Date(disruption.start_time).getTime()) * 100
                          ))}%` 
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}