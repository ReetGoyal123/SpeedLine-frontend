'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NotificationBell from '@/components/NotificationBell';
import useDisruptions from '@/hooks/useDisruptions';
import { getDisruptionSeverityColor } from '@/lib/utils';
import { Train, AlertTriangle, Wrench, Construction, AlertCircle, CheckCircle, Clock, Activity, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DisruptionsPage() {
  const { disruptions, isLoading } = useDisruptions();
  const [activeTab, setActiveTab] = useState('all');

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-5 h-5" />;
      case 'medium': return <AlertCircle className="w-5 h-5" />;
      case 'low': return <Clock className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'signal_failure': return <Activity className="w-5 h-5" />;
      case 'maintenance': return <Wrench className="w-5 h-5" />;
      case 'track_work': return <Construction className="w-5 h-5" />;
      case 'emergency': return <AlertTriangle className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  const filteredDisruptions = disruptions.filter(disruption => {
    if (activeTab === 'all') return true;
    return disruption.severity === activeTab;
  });

  const tabs = [
    { id: 'all', label: 'All Disruptions', count: disruptions.length },
    { id: 'high', label: 'High Priority', count: disruptions.filter(d => d.severity === 'high').length },
    { id: 'medium', label: 'Medium Priority', count: disruptions.filter(d => d.severity === 'medium').length },
    { id: 'low', label: 'Low Priority', count: disruptions.filter(d => d.severity === 'low').length },
  ];

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
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg">
                  Disruptions
                </Button>
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
            
            {/* Right side with notification bell */}
            <div className="flex items-center">
              <NotificationBell 
                disruptions={disruptions}
                trainData={[]}
              />
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-8xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Service Disruptions</h1>
          <p className="mt-2 text-gray-600">
            Current service disruptions and their impact on train operations
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full mb-4"
            />
            <p className="text-gray-500 text-sm">Loading disruption data...</p>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl w-fit">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-blue-700 bg-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Disruptions Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Total Disruptions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-red-600 mb-1">{disruptions.length}</div>
              <p className="text-sm text-gray-500">Active incidents</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                High Severity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-red-600 mb-1">
                {disruptions.filter(d => d.severity === 'high').length}
              </div>
              <p className="text-sm text-gray-500">Requiring immediate attention</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Train className="w-4 h-4" />
                Affected Trains
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-yellow-600 mb-1">
                {disruptions.reduce((sum, d) => sum + d.affected_trains.length, 0)}
              </div>
              <p className="text-sm text-gray-500">Currently impacted</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Disruptions List */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {filteredDisruptions.length === 0 ? (
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="text-center py-16">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 15,
                      delay: 0.2 
                    }}
                    className="mb-6"
                  >
                    <div className="relative inline-block">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute inset-0 bg-green-100 rounded-full"
                      />
                      <CheckCircle className="relative w-16 h-16 text-green-600" />
                    </div>
                  </motion.div>
                  <motion.h3 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl font-semibold text-gray-900 mb-2"
                  >
                    {activeTab === 'all' ? 'No Active Disruptions' : `No ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Priority Disruptions`}
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-500"
                  >
                    {activeTab === 'all' ? 'All sections are operating normally' : `No ${activeTab} priority incidents at this time`}
                  </motion.p>
                </CardContent>
              </Card>
            ) : (
              filteredDisruptions.map((disruption, index) => (
                <motion.div
                  key={disruption.section_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className={`${getDisruptionSeverityColor(disruption.severity)} border-b border-gray-100`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-white/20 rounded-lg">
                            {getSeverityIcon(disruption.severity)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              Section {disruption.section_id} - {disruption.type.replace('_', ' ').toUpperCase()}
                            </CardTitle>
                            <p className="text-sm opacity-75 mt-1">
                              Severity: {disruption.severity.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <div className="p-2 bg-white/20 rounded-lg">
                          {getTypeIcon(disruption.type)}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Disruption Details */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Details
                          </h4>
                          <p className="text-gray-700 mb-6">{disruption.description}</p>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <span className="text-gray-600 font-medium">Started:</span>
                              <span className="text-gray-900 font-semibold">
                                {new Date(disruption.start_time).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <span className="text-gray-600 font-medium">Est. Resolution:</span>
                              <span className="text-gray-900 font-semibold">
                                {new Date(disruption.estimated_end_time).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <span className="text-gray-600 font-medium">Duration:</span>
                              <span className="text-gray-900 font-semibold">
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
                          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Train className="w-4 h-4" />
                            Affected Trains ({disruption.affected_trains.length})
                          </h4>
                          {disruption.affected_trains.length === 0 ? (
                            <div className="text-center py-8">
                              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                              <p className="text-gray-500 text-sm">No trains currently affected</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {disruption.affected_trains.map((trainId) => (
                                <div 
                                  key={trainId}
                                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                                >
                                  <span className="font-semibold text-gray-900">{trainId}</span>
                                  <span className="text-sm text-red-700 bg-red-100 px-3 py-1 rounded-lg font-medium">
                                    Delayed
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-8">
                        <div className="flex justify-between text-sm text-gray-600 mb-3">
                          <span className="font-medium">Resolution Progress</span>
                          <span className="font-semibold">
                            {Math.min(100, Math.round(
                              (Date.now() - new Date(disruption.start_time).getTime()) /
                              (new Date(disruption.estimated_end_time).getTime() - new Date(disruption.start_time).getTime()) * 100
                            ))}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${Math.min(100, Math.round(
                                (Date.now() - new Date(disruption.start_time).getTime()) /
                                (new Date(disruption.estimated_end_time).getTime() - new Date(disruption.start_time).getTime()) * 100
                              ))}%` 
                            }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}