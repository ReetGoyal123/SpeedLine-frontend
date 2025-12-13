import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { axiosInstance } from '@/lib/api';
import { RotateCcw, Play, Pause, Activity, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface ControlPanelProps {
  onRefreshToggle: (enabled: boolean) => void;
  isRefreshEnabled: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onRefreshToggle,
  isRefreshEnabled
}) => {
  const [isResetting, setIsResetting] = useState(false);

  const handleResetSimulation = async () => {
    setIsResetting(true);
    try {
      await axiosInstance.post('/reset');
      console.log('Simulation reset successfully');
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to reset simulation:', error);
      // Fallback: just log the attempt
      console.log('Reset simulation request sent (backend may not be available)');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="card-futuristic w-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Control Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Reset Simulation */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-gray-700">
                Simulation Control
              </label>
              <Button
                variant="destructive"
                onClick={handleResetSimulation}
                disabled={isResetting}
                className="w-full btn-primary"
                style={{ background: 'linear-gradient(to right, #dc2626, #b91c1c)' }}
              >
                <motion.div
                  animate={isResetting ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 1, repeat: isResetting ? Infinity : 0, ease: "linear" }}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  {isResetting ? 'Resetting...' : 'Reset Simulation'}
                </motion.div>
              </Button>
              <p className="text-xs text-gray-500">
                Resets all trains to initial positions
              </p>
            </motion.div>

            {/* Refresh Control */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-gray-700">
                Auto Refresh
              </label>
              <Button
                variant={isRefreshEnabled ? "default" : "outline"}
                onClick={() => onRefreshToggle(!isRefreshEnabled)}
                className={`w-full transition-all duration-300 ${
                  isRefreshEnabled ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                <motion.div
                  animate={isRefreshEnabled ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={{ duration: 2, repeat: isRefreshEnabled ? Infinity : 0 }}
                  className="flex items-center gap-2"
                >
                  {isRefreshEnabled ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  {isRefreshEnabled ? 'Pause Updates' : 'Resume Updates'}
                </motion.div>
              </Button>
              <p className="text-xs text-gray-500">
                {isRefreshEnabled ? 'Data updates every 15s' : 'Updates paused'}
              </p>
            </motion.div>
          </div>

          {/* Status Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="border-t border-gray-200 pt-4"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">System Status:</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center space-x-2"
              >
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-green-600 font-medium">Active</span>
              </motion.div>
            </div>

            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-600">Data Refresh:</span>
              <motion.div
                animate={isRefreshEnabled ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 2, repeat: isRefreshEnabled ? Infinity : 0 }}
                className="flex items-center space-x-2"
              >
                <div className={`w-2 h-2 rounded-full ${
                  isRefreshEnabled ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'
                }`}></div>
                <span className={`font-medium ${
                  isRefreshEnabled ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {isRefreshEnabled ? 'Enabled' : 'Paused'}
                </span>
              </motion.div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ControlPanel;