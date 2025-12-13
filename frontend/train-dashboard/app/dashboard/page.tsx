'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import StatsCard from '@/components/StatsCard';
import TrainVisualization from '@/components/TrainVisualization';
import ControlPanel from '@/components/ControlPanel';
import NotificationBell from '@/components/NotificationBell';
import SettingsDrawer from '@/components/SettingsDrawer';
import useTrainData from '@/hooks/useTrainData';
import useHealthData from '@/hooks/useHealthData';
import useDisruptions from '@/hooks/useDisruptions';
import { Train, Zap, CheckCircle, Clock, Settings, Activity, TrendingUp, AlertTriangle, Route, BarChart3, MapPin, Timer, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

// Real-time Train Performance Chart
const TrainPerformanceChart: React.FC<{ trainData: any[] }> = ({ trainData }) => {
  const [performanceHistory, setPerformanceHistory] = useState([
    { time: '10:00', onTime: 85, delayed: 12, cancelled: 3 },
    { time: '10:15', onTime: 88, delayed: 10, cancelled: 2 },
    { time: '10:30', onTime: 82, delayed: 15, cancelled: 3 },
    { time: '10:45', onTime: 90, delayed: 8, cancelled: 2 },
    { time: '11:00', onTime: 87, delayed: 11, cancelled: 2 },
    { time: '11:15', onTime: 85, delayed: 13, cancelled: 2 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPerformanceHistory(prev => {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const newData = {
          time: timeString,
          onTime: Math.max(70, Math.min(95, 85 + (Math.random() - 0.5) * 20)),
          delayed: Math.max(5, Math.min(25, 12 + (Math.random() - 0.5) * 10)),
          cancelled: Math.max(0, Math.min(8, 3 + (Math.random() - 0.5) * 4))
        };
        return [...prev.slice(1), newData];
      });
    }, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Train Performance Trends</h3>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={performanceHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              stroke="#666"
              fontSize={12}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="onTime" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              name="On Time %"
            />
            <Line 
              type="monotone" 
              dataKey="delayed" 
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
              name="Delayed %"
            />
            <Line 
              type="monotone" 
              dataKey="cancelled" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              name="Cancelled %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// Section Capacity Utilization Chart
const SectionCapacityChart: React.FC<{ trainData: any[] }> = ({ trainData }) => {
  const [capacityData, setCapacityData] = useState([
    { section: 'SEC_1', utilization: 75, capacity: 100, trains: 7 },
    { section: 'SEC_2', utilization: 45, capacity: 80, trains: 4 },
    { section: 'SEC_3', utilization: 90, capacity: 120, trains: 11 },
    { section: 'SEC_4', utilization: 65, capacity: 90, trains: 6 },
    { section: 'SEC_5', utilization: 30, capacity: 70, trains: 3 },
    { section: 'SEC_6', utilization: 80, capacity: 110, trains: 9 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCapacityData(prev => prev.map(item => ({
        ...item,
        utilization: Math.max(20, Math.min(100, item.utilization + (Math.random() - 0.5) * 15)),
        trains: Math.max(1, Math.min(15, item.trains + Math.floor((Math.random() - 0.5) * 3)))
      })));
    }, 45000); // Update every 45 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center">
          <BarChart3 className="w-4 h-4 text-cyan-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Section Capacity Utilization</h3>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={capacityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="section" 
              stroke="#666"
              fontSize={12}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value, name) => [
                `${value}${name === 'utilization' ? '%' : ''}`,
                name === 'utilization' ? 'Utilization' : name === 'trains' ? 'Active Trains' : 'Capacity'
              ]}
            />
            <Bar 
              dataKey="utilization" 
              fill="#06b6d4"
              radius={[4, 4, 0, 0]}
              name="utilization"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// Train Type Distribution Pie Chart
const TrainTypeDistributionChart: React.FC<{ trainData: any[] }> = ({ trainData }) => {
  const [distributionData, setDistributionData] = useState([
    { name: 'Express', value: 35, color: '#3b82f6' },
    { name: 'Local', value: 45, color: '#10b981' },
    { name: 'Freight', value: 15, color: '#f59e0b' },
    { name: 'High-Speed', value: 5, color: '#8b5cf6' },
  ]);

  useEffect(() => {
    if (trainData && trainData.length > 0) {
      const typeCounts = trainData.reduce((acc, train) => {
        const type = train.train.type || 'Express';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      const total = Object.values(typeCounts).reduce((sum: number, count: any) => sum + count, 0);
      const newData = [
        { name: 'Express', value: Math.round(((typeCounts['Express'] || 0) / total) * 100), color: '#3b82f6' },
        { name: 'Local', value: Math.round(((typeCounts['Local'] || 0) / total) * 100), color: '#10b981' },
        { name: 'Freight', value: Math.round(((typeCounts['Freight'] || 0) / total) * 100), color: '#f59e0b' },
        { name: 'High-Speed', value: Math.round(((typeCounts['High-Speed'] || 0) / total) * 100), color: '#8b5cf6' },
      ].filter(item => item.value > 0);

      setDistributionData(newData);
    }
  }, [trainData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
          <Activity className="w-4 h-4 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Train Type Distribution</h3>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={distributionData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {distributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value) => [`${value}%`, 'Percentage']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {distributionData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
            <span className="text-sm text-gray-600">{item.name} ({item.value}%)</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Speed Distribution Area Chart
const SpeedDistributionChart: React.FC<{ trainData: any[] }> = ({ trainData }) => {
  const [speedData, setSpeedData] = useState([
    { range: '0-20', count: 5, percentage: 8 },
    { range: '21-40', count: 12, percentage: 20 },
    { range: '41-60', count: 25, percentage: 42 },
    { range: '61-80', count: 15, percentage: 25 },
    { range: '81-100+', count: 3, percentage: 5 },
  ]);

  useEffect(() => {
    if (trainData && trainData.length > 0) {
      const speeds = trainData.map(train => train.train.speed || 0);
      const ranges = [
        { range: '0-20', min: 0, max: 20 },
        { range: '21-40', min: 21, max: 40 },
        { range: '41-60', min: 41, max: 60 },
        { range: '61-80', min: 61, max: 80 },
        { range: '81-100+', min: 81, max: 999 }
      ];

      const distribution = ranges.map(range => {
        const count = speeds.filter(speed => speed >= range.min && speed <= range.max).length;
        const percentage = Math.round((count / speeds.length) * 100);
        return { ...range, count, percentage };
      });

      setSpeedData(distribution);
    }
  }, [trainData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center">
          <BarChart3 className="w-4 h-4 text-rose-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Speed Distribution</h3>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={speedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="range" 
              stroke="#666"
              fontSize={12}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value, name) => [
                `${value}${name === 'percentage' ? '%' : ' trains'}`,
                name === 'percentage' ? 'Percentage' : 'Count'
              ]}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#f43f5e"
              fill="#f43f5e"
              fillOpacity={0.6}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        Speed ranges in km/h
      </div>
    </motion.div>
  );
};

// Real-time Delay Analysis Chart
const DelayAnalysisChart: React.FC<{ trainData: any[] }> = ({ trainData }) => {
  const [delayData, setDelayData] = useState([
    { timeSlot: '6-8 AM', avgDelay: 12, maxDelay: 35, trainCount: 45 },
    { timeSlot: '8-10 AM', avgDelay: 18, maxDelay: 42, trainCount: 62 },
    { timeSlot: '10-12 PM', avgDelay: 8, maxDelay: 28, trainCount: 38 },
    { timeSlot: '12-2 PM', avgDelay: 15, maxDelay: 38, trainCount: 52 },
    { timeSlot: '2-4 PM', avgDelay: 22, maxDelay: 55, trainCount: 58 },
    { timeSlot: '4-6 PM', avgDelay: 25, maxDelay: 68, trainCount: 72 },
    { timeSlot: '6-8 PM', avgDelay: 20, maxDelay: 48, trainCount: 65 },
    { timeSlot: '8-10 PM', avgDelay: 10, maxDelay: 32, trainCount: 35 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDelayData(prev => prev.map(item => ({
        ...item,
        avgDelay: Math.max(5, Math.min(30, item.avgDelay + (Math.random() - 0.5) * 8)),
        maxDelay: Math.max(15, Math.min(80, item.maxDelay + (Math.random() - 0.5) * 15)),
        trainCount: Math.max(20, Math.min(90, item.trainCount + Math.floor((Math.random() - 0.5) * 10)))
      })));
    }, 35000); // Update every 35 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
          <Clock className="w-4 h-4 text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Delay Analysis by Time</h3>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={delayData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="timeSlot" 
              stroke="#666"
              fontSize={10}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value, name) => [
                `${value} ${name === 'avgDelay' || name === 'maxDelay' ? 'min' : 'trains'}`,
                name === 'avgDelay' ? 'Avg Delay' : name === 'maxDelay' ? 'Max Delay' : 'Train Count'
              ]}
            />
            <Bar 
              dataKey="avgDelay" 
              fill="#f59e0b"
              radius={[2, 2, 0, 0]}
              name="avgDelay"
            />
            <Bar 
              dataKey="maxDelay" 
              fill="#ef4444"
              radius={[2, 2, 0, 0]}
              name="maxDelay"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex justify-between items-center text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-gray-600">Avg Delay</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600">Max Delay</span>
          </div>
        </div>
        <div className="text-gray-500">Time in minutes</div>
      </div>
    </motion.div>
  );
};

// Real-time Performance Analytics Component
const PerformanceAnalytics: React.FC<{ trainData: any[], healthData: any }> = ({ trainData, healthData }) => {
  const [performanceMetrics, setPerformanceMetrics] = useState({
    punctualityTrend: 85,
    capacityUtilization: 67,
    energyEfficiency: 78,
    passengerSatisfaction: 82
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPerformanceMetrics({
        punctualityTrend: Math.max(70, Math.min(95, 85 + (Math.random() - 0.5) * 10)),
        capacityUtilization: Math.max(50, Math.min(90, 67 + (Math.random() - 0.5) * 15)),
        energyEfficiency: Math.max(65, Math.min(90, 78 + (Math.random() - 0.5) * 8)),
        passengerSatisfaction: Math.max(70, Math.min(95, 82 + (Math.random() - 0.5) * 12))
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getPerformanceColor = (value: number) => {
    if (value >= 85) return 'text-green-600 bg-green-100';
    if (value >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Performance Analytics</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700">Punctuality</span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPerformanceColor(performanceMetrics.punctualityTrend)}`}>
              {Math.round(performanceMetrics.punctualityTrend)}%
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${performanceMetrics.punctualityTrend}%` }}
              transition={{ duration: 1 }}
              className="h-2 bg-blue-500 rounded-full"
            />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-700">Capacity</span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPerformanceColor(performanceMetrics.capacityUtilization)}`}>
              {Math.round(performanceMetrics.capacityUtilization)}%
            </span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${performanceMetrics.capacityUtilization}%` }}
              transition={{ duration: 1 }}
              className="h-2 bg-green-500 rounded-full"
            />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-700">Energy Efficiency</span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPerformanceColor(performanceMetrics.energyEfficiency)}`}>
              {Math.round(performanceMetrics.energyEfficiency)}%
            </span>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${performanceMetrics.energyEfficiency}%` }}
              transition={{ duration: 1 }}
              className="h-2 bg-purple-500 rounded-full"
            />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-orange-700">Satisfaction</span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPerformanceColor(performanceMetrics.passengerSatisfaction)}`}>
              {Math.round(performanceMetrics.passengerSatisfaction)}%
            </span>
          </div>
          <div className="w-full bg-orange-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${performanceMetrics.passengerSatisfaction}%` }}
              transition={{ duration: 1 }}
              className="h-2 bg-orange-500 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Live Traffic Heat Map Component
const LiveTrafficHeatMap: React.FC<{ trainData: any[] }> = ({ trainData }) => {
  const [trafficData, setTrafficData] = useState([
    { section: 'SEC_1', load: 75, trend: 'up' },
    { section: 'SEC_2', load: 45, trend: 'down' },
    { section: 'SEC_3', load: 90, trend: 'up' },
    { section: 'SEC_4', load: 65, trend: 'stable' },
    { section: 'SEC_5', load: 30, trend: 'down' },
    { section: 'SEC_6', load: 80, trend: 'up' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficData(prev => prev.map(item => ({
        ...item,
        load: Math.max(10, Math.min(100, item.load + (Math.random() - 0.5) * 20)),
        trend: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'up' : 'down') : 'stable'
      })));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const getTrafficColor = (load: number) => {
    if (load >= 80) return 'bg-red-500';
    if (load >= 60) return 'bg-orange-500';
    if (load >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      default: return '→';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
          <MapPin className="w-4 h-4 text-orange-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Live Traffic Heat Map</h3>
      </div>
      
      <div className="space-y-3">
        {trafficData.map((section, index) => (
          <motion.div
            key={section.section}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded ${getTrafficColor(section.load)} shadow-sm`} />
              <span className="text-sm font-medium text-gray-700">{section.section}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{Math.round(section.load)}%</span>
              <span className="text-sm">{getTrendIcon(section.trend)}</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded"></div>
            Low
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-500 rounded"></div>
            Medium
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-orange-500 rounded"></div>
            High
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded"></div>
            Critical
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Predictive Alerts System Component
const PredictiveAlerts: React.FC<{ disruptions: any[], trainData: any[] }> = ({ disruptions, trainData }) => {
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'delay', message: 'TR001 likely to be delayed by 5-8 minutes', severity: 'medium', time: '2 min ago' },
    { id: 2, type: 'capacity', message: 'SEC_3 approaching capacity limit', severity: 'high', time: '1 min ago' },
    { id: 3, type: 'maintenance', message: 'Scheduled maintenance SEC_5 in 30 minutes', severity: 'low', time: 'now' }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-200 text-red-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      case 'low': return 'ℹ️';
      default: return '📢';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Predictive Alerts</h3>
      </div>
      
      <div className="space-y-3">
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg">{getSeverityIcon(alert.severity)}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{alert.message}</p>
                <p className="text-xs opacity-75 mt-1">{alert.time}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Route Efficiency Monitor Component
const RouteEfficiencyMonitor: React.FC<{ trainData: any[] }> = ({ trainData }) => {
  const [efficiencyData, setEfficiencyData] = useState([
    { route: 'Route A→B', efficiency: 85, timesSaved: 12, fuelSaved: 8.5 },
    { route: 'Route B→C', efficiency: 92, timesSaved: 18, fuelSaved: 15.2 },
    { route: 'Route C→D', efficiency: 78, timesSaved: 6, fuelSaved: 4.8 },
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
          <Route className="w-4 h-4 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Route Efficiency</h3>
      </div>
      
      <div className="space-y-4">
        {efficiencyData.map((route, index) => (
          <motion.div
            key={route.route}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-800">{route.route}</span>
              <span className="text-sm font-semibold text-green-600">{route.efficiency}%</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Timer className="w-3 h-3" />
                <span>{route.timesSaved} min saved</span>
              </div>
              <div className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                <span>{route.fuelSaved}L saved</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

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
                <Link href="/simulation">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors">
                    Simulation
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

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Main Content Grid - Responsive Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6"
        >
          {/* Train Visualization - Full Width */}
          <div className="w-full">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <TrainVisualization trainData={trainData} showDisruptions={true} />
            </div>
          </div>

          {/* Control Panel & Analytics - Two Column on Large Screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Control Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <ControlPanel
                onRefreshToggle={setIsRefreshEnabled}
                isRefreshEnabled={isRefreshEnabled}
              />
            </div>

            {/* Performance Analytics */}
            <PerformanceAnalytics trainData={trainData} healthData={healthData} />
          </div>

          {/* Charts Grid - Responsive 2 Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrainPerformanceChart trainData={trainData} />
            <SectionCapacityChart trainData={trainData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrainTypeDistributionChart trainData={trainData} />
            <SpeedDistributionChart trainData={trainData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DelayAnalysisChart trainData={trainData} />
            <LiveTrafficHeatMap trainData={trainData} />
          </div>

          {/* Additional Widgets - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PredictiveAlerts disruptions={disruptions} trainData={trainData} />
            <RouteEfficiencyMonitor trainData={trainData} />
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