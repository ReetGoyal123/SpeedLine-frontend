'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function OptimizationPage() {
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
                <Button variant="default" size="sm">AI Optimization</Button>
                <Link href="/optimization-engine">
                  <Button variant="ghost" size="sm">Optimization Engine</Button>
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
        {/* Redirect Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-blue-900 mb-4">Optimization Moved!</h1>
          <p className="text-blue-700 mb-6">
            The AI optimization functionality has been integrated into the real-time optimization engine.
          </p>
          <Link href="/optimization-engine">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Go to Optimization Engine →
            </Button>
          </Link>
        </div>

        <div className="mt-8 bg-white rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">🔄 What Changed</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• All optimization logic is now in the Optimization Engine page</li>
            <li>• Real-time polling every 20 seconds (not multiple hooks)</li>
            <li>• Integrated decision_taker.py logic directly in frontend</li>
            <li>• No separate optimization API calls needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}