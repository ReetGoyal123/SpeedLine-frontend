'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import RealTimeOptimization from '@/components/RealTimeOptimization';

export default function OptimizationEnginePage() {
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
                <Button variant="default" size="sm">Optimization Engine</Button>
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
          <h1 className="text-3xl font-bold text-gray-900">Real-time Optimization Engine</h1>
          <p className="mt-2 text-gray-600">
            Live AI-powered train traffic optimization with complete decision_taker.py logic integrated into frontend
          </p>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-blue-600 text-lg mr-2">🤖</span>
              <div>
                <h3 className="text-blue-800 font-semibold">Integrated AI Optimization Engine</h3>
                <p className="text-blue-700 text-sm">
                  Complete Python decision_taker.py logic now runs in frontend with 20-second polling cycle.
                  No separate Python decision_taker.py process required!
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-green-600 text-lg mr-2">✅</span>
              <div>
                <h3 className="text-green-800 font-semibold">Simplified Setup</h3>
                <p className="text-green-700 text-sm">
                  Just run these two commands:
                  <br />• <code className="bg-gray-100 px-1 rounded">python data_1.py</code> (backend API server)
                  <br />• <code className="bg-gray-100 px-1 rounded">npm run dev</code> (frontend with integrated optimization)
                  <br />All optimization logic, conflict detection, and AI scheduling is handled by the frontend.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Optimization Component */}
        <RealTimeOptimization 
          apiBaseUrl="http://localhost:8000"
          pollingInterval={20000} // 20 seconds like Python decision_taker.py
          autoStart={true}
        />

        {/* Technical Details */}
        <div className="mt-8 bg-white rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">🔧 Technical Implementation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Core Features (from decision_taker.py)</h4>
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
        </div>

        {/* API Endpoints */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">📡 API Endpoints Used</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <div><code className="bg-blue-100 px-2 py-1 rounded">GET /api/train-data</code> - Fetch current train status</div>
            <div><code className="bg-blue-100 px-2 py-1 rounded">POST /api/optimization/results</code> - Save optimization results</div>
            <div><code className="bg-blue-100 px-2 py-1 rounded">GET /api/disruptions</code> - Get active disruptions</div>
          </div>
        </div>

        {/* Network Configuration */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">🛤️ Railway Network Configuration</h4>
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
        </div>
      </div>
    </div>
  );
}