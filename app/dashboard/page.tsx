'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import StatsCard from '@/components/StatsCard';
import TrainVisualization from '@/components/TrainVisualization';
import ControlPanel from '@/components/ControlPanel';
import Legend from '@/components/Legend';
import NotificationBell from '@/components/NotificationBell';
import SettingsDrawer from '@/components/SettingsDrawer';
import useTrainData from '@/hooks/useTrainData';
import useHealthData from '@/hooks/useHealthData';
import useDisruptions from '@/hooks/useDisruptions';
import { Train, Zap, CheckCircle, Clock, Settings, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const [isRefreshEnabled, setIsRefreshEnabled] = useState(false); // Disabled by default to prevent conflicts with optimization engine
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { trainData, isLoading: trainsLoading } = useTrainData(
    isRefreshEnabled ? 15000 : 0
  );
  const { healthData } = useHealthData(isRefreshEnabled ? 20000 : 0);
  const { disruptions } = useDisruptions(isRefreshEnabled ? 15000 : 0);

  const onTimeTrains = trainData.filter(t => t.train.status === 'On time').length;
  const delayedTrains = trainData.filter(t => t.train.status === 'Delayed').length;
  const avgSpeed = trainData.length > 0
    ? Math.round(trainData.reduce((sum, t) => sum + t.train.max_speed_kmh, 0) / trainData.length)
    : 0;
  const avgDelay = delayedTrains > 0
    ? Math.round(trainData
        .filter(t => t.train.status === 'Delayed')
        .reduce((sum, t) => sum + (t.event.delay_duration_min || 0), 0) / delayedTrains)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50"
    >
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
              <div className="hidden md:flex space-x-1">
                <Link href="/disruptions">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors">
                    Disruptions
                  </Button>
                </Link>
                <Link href="/optimization">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors">
                    Live Route
                  </Button>
                </Link>
                <Link href="/optimization-engine">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors">
                    Live Engine
                  </Button>
                </Link>
                <Link href="/health">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors">
                    System Health
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* Notification Bell */}
              <NotificationBell 
                disruptions={disruptions}
                trainData={trainData}
              />

              {/* Live indicator */}
              <motion.div
                animate={{ scale: isRefreshEnabled ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center space-x-2"
              >
                <div className={`w-2 h-2 rounded-full ${
                  isRefreshEnabled ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <span className="text-sm font-medium text-gray-600">
                  {isRefreshEnabled ? 'LIVE' : 'PAUSED'}
                </span>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSettingsOpen(true)}
                  className="border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-8xl mx-auto px-6 lg:px-8 py-8">
        {/* Loading State */}
        {trainsLoading && trainData.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full mb-4"
            />
            <p className="text-gray-500 text-sm">Loading train data...</p>
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatsCard
            title="Total Trains Running"
            value={healthData.active_trains}
            description="Currently active trains"
            icon={<Train className="w-6 h-6 text-blue-600" />}
            trend={{ value: 5.2, isPositive: true }}
          />
          <StatsCard
            title="Average Speed"
            value={`${avgSpeed} km/h`}
            description="System-wide average"
            icon={<Zap className="w-6 h-6 text-yellow-600" />}
            trend={{ value: 2.1, isPositive: true }}
          />
          <StatsCard
            title="On Time Performance"
            value={`${Math.round((onTimeTrains / trainData.length) * 100) || 0}%`}
            description={`${onTimeTrains} of ${trainData.length} trains`}
            icon={<CheckCircle className="w-6 h-6 text-green-600" />}
            trend={{ value: 1.5, isPositive: false }}
          />
          <StatsCard
            title="Average Delay"
            value={`${avgDelay} min`}
            description={delayedTrains > 0 ? `${delayedTrains} delayed trains` : 'No delays'}
            icon={<Clock className="w-6 h-6 text-orange-600" />}
            trend={{ value: 3.2, isPositive: false }}
          />
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-8"
        >
          {/* Train Visualization - Takes up most space */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <TrainVisualization trainData={trainData} showDisruptions={true} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Control Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <ControlPanel
                onRefreshToggle={setIsRefreshEnabled}
                isRefreshEnabled={isRefreshEnabled}
              />
            </div>

            {/* Legend */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <Legend />
            </div>
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="text-center p-6 rounded-xl bg-gray-50 border border-gray-100"
            >
              <div className="text-3xl font-bold text-green-600 mb-2">{healthData.active_trains}</div>
              <div className="text-sm text-gray-600 font-medium mb-3">Active Trains</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-green-500 h-2 rounded-full"
                />
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="text-center p-6 rounded-xl bg-gray-50 border border-gray-100"
            >
              <div className="text-3xl font-bold text-orange-600 mb-2">{healthData.active_disruptions}</div>
              <div className="text-sm text-gray-600 font-medium mb-3">Active Disruptions</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, healthData.active_disruptions * 20)}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="bg-orange-500 h-2 rounded-full"
                />
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="text-center p-6 rounded-xl bg-gray-50 border border-gray-100"
            >
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {Math.round(((6 - healthData.disrupted_sections.length) / 6) * 100)}%
              </div>
              <div className="text-sm text-gray-600 font-medium mb-3">Network Availability</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((6 - healthData.disrupted_sections.length) / 6) * 100}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="bg-blue-500 h-2 rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Settings Drawer */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </motion.div>
  );
}