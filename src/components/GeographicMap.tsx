'use client';

import React, { useState, useRef } from 'react';
import { Train, ZoomIn, ZoomOut, RotateCcw, Navigation, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TrainPosition {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'On Time' | 'Delayed' | 'Stopped';
  speed: number;
  destination: string;
  section: string;
}

interface Station {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

interface RouteConnection {
  from: string;
  to: string;
  section: string;
  type: 'single' | 'double' | 'triple';
}

const GeographicMap: React.FC = () => {
  const [zoom, setZoom] = useState(50);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredTrain, setHoveredTrain] = useState<string | null>(null);
  const mapRef = useRef<SVGSVGElement>(null);

  // Mock stations data
  const stations: Station[] = [
    { id: 'STN_A', name: 'Central Station', lat: 28.6139, lng: 77.2090 },
    { id: 'STN_B', name: 'North Junction', lat: 28.6500, lng: 77.2300 },
    { id: 'STN_C', name: 'East Terminal', lat: 28.6400, lng: 77.2800 },
    { id: 'STN_D', name: 'Industrial Hub', lat: 28.6100, lng: 77.3200 },
    { id: 'STN_E', name: 'South Gateway', lat: 28.5800, lng: 77.3000 },
    { id: 'STN_F', name: 'Metro Plaza', lat: 28.5500, lng: 77.2500 },
  ];

  // Mock route connections
  const routes: RouteConnection[] = [
    { from: 'STN_A', to: 'STN_B', section: 'SEC_1', type: 'double' },
    { from: 'STN_B', to: 'STN_C', section: 'SEC_2', type: 'single' },
    { from: 'STN_C', to: 'STN_D', section: 'SEC_3', type: 'double' },
    { from: 'STN_D', to: 'STN_E', section: 'SEC_4', type: 'single' },
    { from: 'STN_E', to: 'STN_F', section: 'SEC_5', type: 'triple' },
    { from: 'STN_B', to: 'STN_E', section: 'SEC_6', type: 'single' }, // Bypass route
  ];

  // Mock train positions (10 trains as requested)
  const trainPositions: TrainPosition[] = [
    { id: 'T001', name: 'Express 001', lat: 28.6320, lng: 77.2200, status: 'On Time', speed: 85, destination: 'STN_F', section: 'SEC_1' },
    { id: 'T002', name: 'Local 002', lat: 28.6450, lng: 77.2600, status: 'Delayed', speed: 45, destination: 'STN_D', section: 'SEC_2' },
    { id: 'T003', name: 'Express 003', lat: 28.6250, lng: 77.3000, status: 'On Time', speed: 78, destination: 'STN_A', section: 'SEC_3' },
    { id: 'T004', name: 'Freight 004', lat: 28.5950, lng: 77.3100, status: 'Stopped', speed: 0, destination: 'STN_E', section: 'SEC_4' },
    { id: 'T005', name: 'Express 005', lat: 28.5650, lng: 77.2750, status: 'On Time', speed: 92, destination: 'STN_A', section: 'SEC_5' },
    { id: 'T006', name: 'Local 006', lat: 28.6200, lng: 77.2650, status: 'On Time', speed: 65, destination: 'STN_E', section: 'SEC_6' },
    { id: 'T007', name: 'Express 007', lat: 28.6080, lng: 77.2150, status: 'Delayed', speed: 35, destination: 'STN_C', section: 'SEC_1' },
    { id: 'T008', name: 'Local 008', lat: 28.6350, lng: 77.2750, status: 'On Time', speed: 55, destination: 'STN_F', section: 'SEC_3' },
    { id: 'T009', name: 'Freight 009', lat: 28.5900, lng: 77.2900, status: 'On Time', speed: 40, destination: 'STN_B', section: 'SEC_4' },
    { id: 'T010', name: 'Express 010', lat: 28.5600, lng: 77.2400, status: 'On Time', speed: 88, destination: 'STN_D', section: 'SEC_5' },
  ];

  // Convert geographic coordinates to SVG coordinates
  const geoToSVG = (lat: number, lng: number) => {
    const minLat = 28.5400;
    const maxLat = 28.6600;
    const minLng = 77.2000;
    const maxLng = 77.3300;
    
    const x = ((lng - minLng) / (maxLng - minLng)) * 800;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 600;
    
    return { x, y };
  };

  // Handle mouse events for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom controls
  const handleZoomIn = () => setZoom(Math.min(zoom + 10, 100));
  const handleZoomOut = () => setZoom(Math.max(zoom - 10, 20));
  const handleReset = () => {
    setZoom(50);
    setPan({ x: 0, y: 0 });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Time': return '#10b981'; // green
      case 'Delayed': return '#f59e0b'; // yellow
      case 'Stopped': return '#ef4444'; // red
      default: return '#6b7280'; // gray
    }
  };

  const getTrackWidth = (type: string) => {
    switch (type) {
      case 'single': return 2;
      case 'double': return 4;
      case 'triple': return 6;
      default: return 2;
    }
  };

  return (
    <div className="relative w-full h-[700px] bg-white rounded-lg border shadow-sm overflow-hidden">
      {/* Map Container */}
      <svg
        ref={mapRef}
        className="w-full h-full cursor-grab"
        viewBox="0 0 800 600"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Background Grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f8fafc" strokeWidth="1"/>
          </pattern>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="1" stdDeviation="2" floodOpacity="0.3"/>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="#fefefe" />
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom / 50})`}>
          {/* Route Connections */}
          {routes.map((route, index) => {
            const fromStation = stations.find(s => s.id === route.from);
            const toStation = stations.find(s => s.id === route.to);
            
            if (!fromStation || !toStation) return null;
            
            const fromPos = geoToSVG(fromStation.lat, fromStation.lng);
            const toPos = geoToSVG(toStation.lat, toStation.lng);
            
            return (
              <g key={index}>
                {/* Route line */}
                <line
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke="#d1d5db"
                  strokeWidth={getTrackWidth(route.type)}
                  strokeDasharray={route.section === 'SEC_6' ? "8,4" : "none"}
                  opacity="0.8"
                />
                
                {/* Section label */}
                <text
                  x={(fromPos.x + toPos.x) / 2}
                  y={(fromPos.y + toPos.y) / 2 - 8}
                  textAnchor="middle"
                  className="fill-gray-500 text-xs font-medium"
                  fontSize="11"
                >
                  {route.section}
                </text>
              </g>
            );
          })}

          {/* City/Station Markers */}
          {stations.map((station) => {
            const pos = geoToSVG(station.lat, station.lng);
            return (
              <g key={station.id}>
                {/* Station circle with shadow */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="10"
                  fill="#3b82f6"
                  stroke="#ffffff"
                  strokeWidth="3"
                  filter="url(#shadow)"
                />
                
                {/* Station inner dot */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="4"
                  fill="#ffffff"
                />
                
                {/* Station label */}
                <text
                  x={pos.x}
                  y={pos.y + 28}
                  textAnchor="middle"
                  className="fill-gray-800 font-semibold"
                  fontSize="12"
                >
                  {station.name}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 42}
                  textAnchor="middle"
                  className="fill-gray-500 text-xs"
                  fontSize="10"
                >
                  {station.id}
                </text>
              </g>
            );
          })}

          {/* Train Positions */}
          {trainPositions.map((train) => {
            const pos = geoToSVG(train.lat, train.lng);
            const isHovered = hoveredTrain === train.id;
            
            return (
              <g
                key={train.id}
                onMouseEnter={() => setHoveredTrain(train.id)}
                onMouseLeave={() => setHoveredTrain(null)}
                className="cursor-pointer"
              >
                {/* Train marker */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isHovered ? "10" : "8"}
                  fill={getStatusColor(train.status)}
                  stroke="#ffffff"
                  strokeWidth="3"
                  className="transition-all duration-200"
                  filter="url(#shadow)"
                />
                
                {/* Train icon */}
                <g transform={`translate(${pos.x - 5}, ${pos.y - 5})`}>
                  <rect width="10" height="10" fill="none" />
                  <path 
                    d="M2 6 L8 6 M3 3 L7 3 M2 7 L8 7"
                    stroke="white" 
                    strokeWidth="1.5" 
                    strokeLinecap="round"
                  />
                </g>
                
                {/* Train ID label */}
                <text
                  x={pos.x}
                  y={pos.y - 15}
                  textAnchor="middle"
                  className="fill-gray-800 font-bold text-xs"
                  fontSize="11"
                >
                  {train.id}
                </text>
                
                {/* Hover pulse effect */}
                {isHovered && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="12"
                    fill="none"
                    stroke={getStatusColor(train.status)}
                    strokeWidth="2"
                    opacity="0.6"
                    className="animate-pulse"
                  />
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Control Overlays */}
      <div className="absolute top-6 right-6 bg-white rounded-lg shadow-lg border p-3 space-y-2">
        <div className="text-xs text-gray-500 font-medium mb-2 text-center">Map Controls</div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleZoomIn}
          className="w-full hover:bg-blue-50 hover:border-blue-200"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleZoomOut}
          className="w-full hover:bg-blue-50 hover:border-blue-200"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleReset}
          className="w-full hover:bg-blue-50 hover:border-blue-200"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Minimalist Navigation Legend */}
      <div className="absolute bottom-6 left-6 bg-white rounded-lg shadow-lg border p-4 space-y-3">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          <Navigation className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-semibold text-gray-800">Network Legend</span>
        </div>
        
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
            <span className="text-gray-700">City Stations</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
            <span className="text-gray-700">On Time</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
            <span className="text-gray-700">Delayed</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
            <span className="text-gray-700">Stopped</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-0.5 bg-gray-400"></div>
            <span className="text-gray-700">Single Track</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-1 bg-gray-400"></div>
            <span className="text-gray-700">Double Track</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-1.5 bg-gray-400"></div>
            <span className="text-gray-700">Triple Track</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="32" height="4">
              <line x1="0" y1="2" x2="32" y2="2" stroke="#9ca3af" strokeWidth="2" strokeDasharray="4,2"/>
            </svg>
            <span className="text-gray-700">Bypass Route</span>
          </div>
        </div>
      </div>

      {/* Train Details Tooltip */}
      {hoveredTrain && (
        <div className="absolute top-6 left-6 bg-white rounded-lg shadow-lg border p-4 min-w-[220px] z-10">
          {(() => {
            const train = trainPositions.find(t => t.id === hoveredTrain);
            if (!train) return null;
            
            return (
              <div className="space-y-3">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: getStatusColor(train.status) }}
                  ></div>
                  <span className="font-bold text-gray-900">{train.name}</span>
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Train ID:</span>
                    <span className="font-medium text-gray-900">{train.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className="font-medium" style={{ color: getStatusColor(train.status) }}>
                      {train.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Speed:</span>
                    <span className="font-medium text-gray-900">{train.speed} km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Section:</span>
                    <span className="font-medium text-gray-900">{train.section}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Destination:</span>
                    <span className="font-medium text-gray-900">{train.destination}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Position:</span>
                    <span className="font-mono text-gray-600">
                      {train.lat.toFixed(4)}°, {train.lng.toFixed(4)}°
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Zoom Level Indicator */}
      <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg border px-3 py-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-600 font-medium">Zoom: {zoom}%</span>
        </div>
      </div>
    </div>
  );
};

export default GeographicMap;