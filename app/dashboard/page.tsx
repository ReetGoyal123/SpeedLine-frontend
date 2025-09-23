'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import StatsCard from '@/components/StatsCard';
import TrainVisualization from '@/components/TrainVisualization';
import ControlPanel from '@/components/ControlPanel';
import Legend from '@/components/Legend';
import Notifications from '@/components/Notifications';
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
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-blue-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/">
                <motion.h1
                  whileHover={{ scale: 1.05 }}
                  className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer flex items-center gap-2"
                >
                  <Train className="w-8 h-8 text-blue-600" />
                  SpeedLine Dashboard
                </motion.h1>
              </Link>
              <div className="flex space-x-4">
                <Link href="/disruptions">
                  <Button variant="ghost" size="sm" className="nav-link">
                    Disruptions
                  </Button>
                </Link>
                <Link href="/optimization">
                  <Button variant="ghost" size="sm" className="nav-link">
                    AI Optimization
                  </Button>
                </Link>
                <Link href="/optimization-engine">
                  <Button variant="ghost" size="sm" className="nav-link">
                    Live Engine
                  </Button>
                </Link>
                <Link href="/health">
                  <Button variant="ghost" size="sm" className="nav-link">
                    System Health
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Live indicator */}
              <motion.div
                animate={{ scale: isRefreshEnabled ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center space-x-2"
              >
                <div className={`w-2 h-2 rounded-full ${
                  isRefreshEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`} />
                <span className="text-sm font-medium text-gray-600">
                  {isRefreshEnabled ? 'LIVE' : 'PAUSED'}
                </span>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSettingsOpen(true)}
                  className="btn-secondary"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {trainsLoading && trainData.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600 font-medium">Loading train data...</p>
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-8"
        >
          {/* Train Visualization - Takes up most space */}
          <div className="lg:col-span-3">
            <TrainVisualization trainData={trainData} showDisruptions={true} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Control Panel */}
            <ControlPanel
              onRefreshToggle={setIsRefreshEnabled}
              isRefreshEnabled={isRefreshEnabled}
            />

            {/* Legend */}
            <Legend />

            {/* Notifications */}
            <Notifications
              disruptions={disruptions}
              trainData={trainData}
            />
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 card-futuristic p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="text-center p-4 rounded-lg bg-green-50 border border-green-200"
            >
              <div className="text-3xl font-bold text-green-600">{healthData.active_trains}</div>
              <div className="text-sm text-gray-600 font-medium">Active Trains</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-green-500 h-2 rounded-full"
                />
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="text-center p-4 rounded-lg bg-yellow-50 border border-yellow-200"
            >
              <div className="text-3xl font-bold text-yellow-600">{healthData.active_disruptions}</div>
              <div className="text-sm text-gray-600 font-medium">Active Disruptions</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, healthData.active_disruptions * 20)}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="bg-yellow-500 h-2 rounded-full"
                />
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200"
            >
              <div className="text-3xl font-bold text-blue-600">
                {Math.round(((6 - healthData.disrupted_sections.length) / 6) * 100)}%
              </div>
              <div className="text-sm text-gray-600 font-medium">Network Availability</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
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