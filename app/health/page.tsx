'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NotificationBell from '@/components/NotificationBell';
import useHealthData from '@/hooks/useHealthData';
import useTrainData from '@/hooks/useTrainData';
import useDisruptions from '@/hooks/useDisruptions';
import { 
  Train, CheckCircle, AlertTriangle, XCircle, Search, 
  Activity, TrendingUp, AlertOctagon, BarChart3, 
  Settings, FileText, AlertCircle
} from 'lucide-react';

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
      case 'healthy': return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case 'critical': return <XCircle className="w-6 h-6 text-red-600" />;
      default: return <Search className="w-6 h-6 text-gray-600" />;
    }
  };

  const networkAvailability = ((6 - healthData.disrupted_sections.length) / 6) * 100;
  const onTimePerformance = trainData.length > 0 
    ? (trainData.filter(t => t.train.status === 'On time').length / trainData.length) * 100
    : 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white shadow-sm border-b border-gray-100"
      >
        <div className="max-w-8xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-12">
              <Link href="/">
                <motion.h1
                  whileHover={{ scale: 1.02 }}
                  className="text-2xl font-semibold text-gray-900 cursor-pointer flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Train className="w-5 h-5 text-white" />
                  </div>
                  SpeedLine
                </motion.h1>
              </Link>
              <div className="flex space-x-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
                <Link href="/disruptions">
                  <Button variant="ghost" size="sm">Disruptions</Button>
                </Link>
                <Link href="/optimization">
                  <Button variant="ghost" size="sm">Live Route</Button>
                </Link>
                <Link href="/optimization-engine">
                  <Button variant="ghost" size="sm">Live Engine</Button>
                </Link>
                <Button variant="default" size="sm">System Health</Button>
              </div>
            </div>
            
            {/* Right side with notification bell */}
            <div className="flex items-center">
              <NotificationBell 
                disruptions={disruptions}
                trainData={trainData}
              />
            </div>
          </div>
        </div>
      </motion.nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">System Health Dashboard</h1>
          </div>
          <p className="text-lg text-gray-600">
            Real-time monitoring of railway system performance and infrastructure status
          </p>
        </motion.div>

        {/* Loading State */}
        {healthLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading system health data...</p>
          </div>
        )}

        {/* Overall Health Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-100 border-blue-200 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                    {getHealthStatusIcon(healthData.status)}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      System Status: <span className={getHealthStatusColor(healthData.status)}>
                        {healthData.status.toUpperCase()}
                      </span>
                    </CardTitle>
                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                      <Activity className="w-4 h-4" />
                      Last updated: {new Date(healthData.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-sm text-gray-600 flex items-center gap-1 justify-end">
                    <TrendingUp className="w-4 h-4" />
                    System Uptime
                  </div>
                  <div className="text-2xl font-bold text-green-600">99.8%</div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Train className="w-5 h-5 text-blue-600" />
                </div>
                <CardTitle className="text-sm font-medium text-gray-600">
                  Active Trains
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{healthData.active_trains}</div>
              <p className="text-xs text-gray-500 mt-1">
                of {healthData.total_trains} total trains
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(healthData.active_trains / healthData.total_trains) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <CardTitle className="text-sm font-medium text-gray-600">
                  Network Availability
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(networkAvailability)}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {6 - healthData.disrupted_sections.length} of 6 sections operational
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${networkAvailability}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <CardTitle className="text-sm font-medium text-gray-600">
                  On-Time Performance
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(onTimePerformance)}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {trainData.filter(t => t.train.status === 'On time').length} trains on schedule
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
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

          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertOctagon className="w-5 h-5 text-red-600" />
                </div>
                <CardTitle className="text-sm font-medium text-gray-600">
                  Active Disruptions
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{healthData.active_disruptions}</div>
              <p className="text-xs text-gray-500 mt-1">
                {disruptions.filter(d => d.severity === 'high').length} high severity
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
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
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Infrastructure Health</CardTitle>
              </div>
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
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <CardTitle className="text-lg">Performance Metrics</CardTitle>
              </div>
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
                    <Button variant="outline" className="w-full justify-start hover:bg-red-50 hover:border-red-200 transition-colors">
                      <AlertCircle className="w-4 h-4 mr-2 text-red-600" />
                      View All Disruptions
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full justify-start hover:bg-blue-50 hover:border-blue-200 transition-colors">
                      <BarChart3 className="w-4 h-4 mr-2 text-blue-600" />
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start hover:bg-green-50 hover:border-green-200 transition-colors">
                    <FileText className="w-4 h-4 mr-2 text-green-600" />
                    Generate Health Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Historical Trends (Placeholder) */}
        <div className="mt-8">
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">24-Hour Performance Trends</CardTitle>
                  <p className="text-sm text-gray-600">
                    Key performance indicators over the past 24 hours
                  </p>
                </div>
              </div>
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
      </motion.div>
    </div>
  );
}