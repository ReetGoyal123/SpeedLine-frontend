'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import GeographicMap from '@/components/GeographicMap';
import NotificationBell from '@/components/NotificationBell';
import { Train, MapPin, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OptimizationPage() {
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
              <div className="flex space-x-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
                <Link href="/disruptions">
                  <Button variant="ghost" size="sm">Disruptions</Button>
                </Link>
                <Button variant="default" size="sm">Live Route</Button>
                <Link href="/optimization-engine">
                  <Button variant="ghost" size="sm">Optimization Engine</Button>
                </Link>
                <Link href="/health">
                  <Button variant="ghost" size="sm">System Health</Button>
                </Link>
              </div>
            </div>
            
            {/* Right side with notification bell */}
            <div className="flex items-center">
              <NotificationBell 
                disruptions={[]}
                trainData={[]}
              />
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-blue-800 font-semibold">Real-Time Network Visualization</h3>
                <p className="text-blue-700 text-sm">
                  Clean cartography with city markers, dotted route connections, and interactive train positioning. 
                  Hover over train markers to view detailed information including train ID, status, speed, and destination.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Geographic Map Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <GeographicMap />
        </motion.div>

        {/* Network Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-lg p-6 border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Train className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Active Trains</h3>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">10</div>
            <p className="text-sm text-gray-600">Currently running on network</p>
          </div>

          <div className="bg-white rounded-lg p-6 border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Network Coverage</h3>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">6</div>
            <p className="text-sm text-gray-600">Major stations connected</p>
          </div>

          <div className="bg-white rounded-lg p-6 border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Track Sections</h3>
            </div>
            <div className="text-3xl font-bold text-yellow-600 mb-2">6</div>
            <p className="text-sm text-gray-600">Including bypass routes</p>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 bg-white rounded-lg p-6 border shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Map Interactions</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Drag to pan across the network</li>
                <li>• Zoom controls for detailed view</li>
                <li>• Reset button to return to default view</li>
                <li>• Clean cartography with light background</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Train Information</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Hover over trains for detailed info</li>
                <li>• Real-time status indicators</li>
                <li>• Speed and destination tracking</li>
                <li>• Section-based positioning</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}