import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTrainTypeColor } from '@/lib/utils';
import { MapPin, AlertTriangle, CheckCircle, Clock, Navigation, XCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const Legend: React.FC = () => {
  const trainTypes = [
    { type: 'Express', description: 'High priority passenger service', icon: '🚄' },
    { type: 'Local', description: 'Regular passenger service', icon: '🚂' },
    { type: 'Freight', description: 'Cargo transportation', icon: '🚛' },
    { type: 'High-Speed', description: 'Premium high-speed service', icon: '⚡' }
  ];

  const disruptionTypes = [
    { type: 'Low', color: 'bg-yellow-100 border-yellow-300 text-yellow-800', description: 'Minor delays expected', icon: AlertTriangle },
    { type: 'Medium', color: 'bg-orange-100 border-orange-300 text-orange-800', description: 'Moderate service impact', icon: AlertTriangle },
    { type: 'High', color: 'bg-red-100 border-red-300 text-red-800', description: 'Significant delays/cancellations', icon: AlertTriangle }
  ];

  const statusIndicators = [
    { status: 'On Time', color: 'bg-green-500', icon: CheckCircle },
    { status: 'Delayed', color: 'bg-yellow-500', icon: Clock },
    { status: 'Waiting', color: 'bg-orange-500', icon: Clock },
    { status: 'Arrived', color: 'bg-blue-500', icon: Navigation },
    { status: 'Cancelled', color: 'bg-red-500', icon: XCircle }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="card-futuristic w-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            Legend
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Train Types */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Train Types
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {trainTypes.map((train, index) => (
                <motion.div
                  key={train.type}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-4 h-4 rounded border-2 ${getTrainTypeColor(train.type)}`}
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{train.type}</div>
                    <div className="text-xs text-gray-500">{train.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Track Types */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h4 className="text-sm font-medium text-gray-700 mb-3">Track Types</h4>
            <div className="space-y-2">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-4 h-4 border-l-4 border-gray-400 rounded" />
                <span className="text-sm text-gray-700">Single Track</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-4 h-4 border-l-2 border-r-2 border-gray-400 rounded" />
                <span className="text-sm text-gray-700">Double Track</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Disruption Severity */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Disruption Severity
            </h4>
            <div className="space-y-2">
              {disruptionTypes.map((disruption, index) => (
                <motion.div
                  key={disruption.type}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center ${disruption.color}`}
                  >
                    <disruption.icon className="w-2.5 h-2.5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{disruption.type}</div>
                    <div className="text-xs text-gray-500">{disruption.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Status Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <h4 className="text-sm font-medium text-gray-700 mb-3">Train Status</h4>
            <div className="space-y-2">
              {statusIndicators.map((status, index) => (
                <motion.div
                  key={status.status}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <motion.div
                    animate={status.status === 'On Time' ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                    transition={{ duration: 2, repeat: status.status === 'On Time' ? Infinity : 0 }}
                    className={`w-3 h-3 rounded-full ${status.color}`}
                  />
                  <div className="flex items-center gap-2">
                    <status.icon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{status.status}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Legend;