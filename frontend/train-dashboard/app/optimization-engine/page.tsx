'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import RealTimeOptimization from '@/components/RealTimeOptimization';
import NotificationBell from '@/components/NotificationBell';
import { Train, Bot, CheckCircle, Wrench, Radio, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OptimizationEnginePage() {
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
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
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
                <Link href="/simulation">
                  <Button variant="ghost" size="sm">Simulation</Button>
                </Link>
                <Button variant="default" size="sm">Optimization Engine</Button>
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Real-time Optimization Engine</h1>
          <p className="mt-2 text-gray-600">
            Live AI-powered train traffic optimization.
          </p>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Bot className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-blue-800 font-semibold">Integrated AI Optimization Engine</h3>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Real-time Optimization Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <RealTimeOptimization 
            apiBaseUrl="http://localhost:8000"
            pollingInterval={20000} // 20 seconds like Python decision_taker.py
            autoStart={true}
          />
        </motion.div>

        {/* Technical Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 bg-white rounded-lg p-6 border"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold">Technical Implementation</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Continuous polling every 20 seconds</li>
                <li>• Real-time conflict detection</li>
                <li>• Priority-based train scheduling</li>
                <li>• Capacity constraint validation</li>
                <li>• Single-track collision avoidance</li>
                <li>• Intelligent fallback optimization</li>
                <li>• Local schedule persistence</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Optimization Logic</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Section capacity management</li>
                <li>• Conflict severity assessment</li>
                <li>• Priority-weighted scheduling</li>
                <li>• Delay minimization algorithms</li>
                <li>• Route optimization (SEC_6 bypass)</li>
                <li>• Real-time status updates</li>
                <li>• Performance monitoring</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* API Endpoints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
              <Radio className="w-4 h-4 text-blue-600" />
            </div>
            <h4 className="font-medium text-blue-900">API Endpoints Used</h4>
          </div>
          <div className="text-sm text-blue-800 space-y-1">
            <div><code className="bg-blue-100 px-2 py-1 rounded">GET /api/train-data</code> - Fetch current train status</div>
            <div><code className="bg-blue-100 px-2 py-1 rounded">POST /api/optimization/results</code> - Save optimization results</div>
            <div><code className="bg-blue-100 px-2 py-1 rounded">GET /api/disruptions</code> - Get active disruptions</div>
          </div>
        </motion.div>

        {/* Network Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900">Railway Network Configuration</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 rounded border">
              <div className="font-medium">SEC_1 (Double Track)</div>
              <div className="text-gray-600">STN_A → STN_B (8.5km, Cap: 2)</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="font-medium">SEC_2 (Single Track)</div>
              <div className="text-gray-600">STN_B → STN_C (6.2km, Cap: 1)</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="font-medium">SEC_3 (Double Track)</div>
              <div className="text-gray-600">STN_C → STN_D (7.8km, Cap: 2)</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="font-medium">SEC_4 (Single Track)</div>
              <div className="text-gray-600">STN_D → STN_E (5.3km, Cap: 1)</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="font-medium">SEC_5 (Triple Track)</div>
              <div className="text-gray-600">STN_E → STN_F (9.1km, Cap: 3)</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="font-medium">SEC_6 (Bypass)</div>
              <div className="text-gray-600">STN_B → STN_E (12.0km, Cap: 1)</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}