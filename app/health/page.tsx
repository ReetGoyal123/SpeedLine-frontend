'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useHealthData from '@/hooks/useHealthData';
import useTrainData from '@/hooks/useTrainData';
import useDisruptions from '@/hooks/useDisruptions';

export default function HealthPage() {
  const { healthData, isLoading: healthLoading } = useHealthData();
  const { trainData } = useTrainData();
  const { disruptions } = useDisruptions();

  const getHealthStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy': return '💚';
      case 'warning': return '💛';
      case 'critical': return '❤️';
      default: return '🔍';
    }
  };

  const networkAvailability = ((6 - healthData.disrupted_sections.length) / 6) * 100;
  const onTimePerformance = trainData.length > 0 
    ? (trainData.filter(t => t.train.status === 'On time').length / trainData.length) * 100
    : 100;

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
                <Link href="/disruptions">
                  <Button variant="ghost" size="sm">Disruptions</Button>
                </Link>
                <Link href="/optimization">
                  <Button variant="ghost" size="sm">AI Optimization</Button>
                </Link>
                <Link href="/optimization-engine">
                  <Button variant="ghost" size="sm">Live Engine</Button>
                </Link>
                <Button variant="default" size="sm">System Health</Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">System Health Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Real-time monitoring of railway system performance and infrastructure status
          </p>
        </div>

        {/* Loading State */}
        {healthLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading system health data...</p>
          </div>
        )}

        {/* Overall Health Status */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-100 border-blue-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{getHealthStatusIcon(healthData.status)}</span>
                  <div>
                    <CardTitle className="text-2xl">
                      System Status: <span className={getHealthStatusColor(healthData.status)}>
                        {healthData.status.toUpperCase()}
                      </span>
                    </CardTitle>
                    <p className="text-gray-600">
                      Last updated: {new Date(healthData.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">System Uptime</div>
                  <div className="text-2xl font-bold text-green-600">99.8%</div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Trains
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{healthData.active_trains}</div>
              <p className="text-xs text-gray-500 mt-1">
                of {healthData.total_trains} total trains
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(healthData.active_trains / healthData.total_trains) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Network Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(networkAvailability)}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {6 - healthData.disrupted_sections.length} of 6 sections operational
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${networkAvailability}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                On-Time Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(onTimePerformance)}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {trainData.filter(t => t.train.status === 'On time').length} trains on schedule
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    onTimePerformance >= 90 ? 'bg-green-500' :
                    onTimePerformance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${onTimePerformance}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Disruptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{healthData.active_disruptions}</div>
              <p className="text-xs text-gray-500 mt-1">
                {disruptions.filter(d => d.severity === 'high').length} high severity
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, healthData.active_disruptions * 20)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Health Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Infrastructure Health */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Infrastructure Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Track Sections */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Track Sections</h4>
                <div className="space-y-2">
                  {['SEC_1', 'SEC_2', 'SEC_3', 'SEC_4', 'SEC_5', 'SEC_6'].map((section) => {
                    const isDisrupted = healthData.disrupted_sections.includes(section);
                    return (
                      <div key={section} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium">{section}</span>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            isDisrupted ? 'bg-red-500' : 'bg-green-500'
                          }`} />
                          <span className={`text-sm font-medium ${
                            isDisrupted ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {isDisrupted ? 'Disrupted' : 'Operational'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Signal Systems */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Signal Systems</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded border border-green-200">
                    <div className="text-2xl font-bold text-green-600">5</div>
                    <div className="text-sm text-green-700">Automatic Signals</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded border border-yellow-200">
                    <div className="text-2xl font-bold text-yellow-600">1</div>
                    <div className="text-sm text-yellow-700">Manual Override</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Average Metrics */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">System Averages</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Speed</span>
                    <span className="font-medium">
                      {trainData.length > 0 
                        ? Math.round(trainData.reduce((sum, t) => sum + t.train.max_speed_kmh, 0) / trainData.length)
                        : 0
                      } km/h
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Delay</span>
                    <span className="font-medium">
                      {trainData.filter(t => t.train.status === 'Delayed').length > 0
                        ? Math.round(trainData
                            .filter(t => t.train.status === 'Delayed')
                            .reduce((sum, t) => sum + (t.event.delay_duration_min || 0), 0) / 
                          trainData.filter(t => t.train.status === 'Delayed').length)
                        : 0
                      } min
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Capacity Utilization</span>
                    <span className="font-medium">67%</span>
                  </div>
                </div>
              </div>

              {/* System Health Score */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Overall Health Score</h4>
                <div className="text-center p-4 bg-green-50 rounded border border-green-200">
                  <div className="text-4xl font-bold text-green-600">87%</div>
                  <div className="text-sm text-green-700 mt-1">Excellent</div>
                  <div className="w-full bg-green-200 rounded-full h-3 mt-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: '87%' }} />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <Link href="/disruptions">
                    <Button variant="outline" className="w-full justify-start">
                      🚨 View All Disruptions
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full justify-start">
                      📊 Go to Dashboard
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start">
                    📋 Generate Health Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Historical Trends (Placeholder) */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">24-Hour Performance Trends</CardTitle>
              <p className="text-sm text-gray-600">
                Key performance indicators over the past 24 hours
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">98.5%</div>
                  <div className="text-sm text-gray-600">Avg Availability</div>
                  <div className="text-xs text-green-600 mt-1">↗ +0.3% from yesterday</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">125.3 km/h</div>
                  <div className="text-sm text-gray-600">Avg Speed</div>
                  <div className="text-xs text-green-600 mt-1">↗ +2.1 km/h from yesterday</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-600">4.2 min</div>
                  <div className="text-sm text-gray-600">Avg Delay</div>
                  <div className="text-xs text-red-600 mt-1">↗ +1.1 min from yesterday</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}