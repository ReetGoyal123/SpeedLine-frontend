import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, AlertTriangle, AlertCircle, CheckCircle, Info, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
}

interface NotificationsProps {
  disruptions?: any[];
  trainData?: any[];
}

const Notifications: React.FC<NotificationsProps> = ({
  disruptions = [],
  trainData = []
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Generate sample notifications
  useEffect(() => {
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        type: 'warning',
        title: 'Train TR002 Delayed',
        message: 'Train TR002 is delayed by 15 minutes due to signal failure in SEC_2',
        timestamp: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
      },
      {
        id: '2',
        type: 'error',
        title: 'Section Disruption',
        message: 'SEC_2 experiencing signal failure - high severity',
        timestamp: new Date(Date.now() - 10 * 60 * 1000) // 10 minutes ago
      },
      {
        id: '3',
        type: 'info',
        title: 'Train TR001 On Schedule',
        message: 'Express train TR001 departed STN_A on time',
        timestamp: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
      },
      {
        id: '4',
        type: 'warning',
        title: 'Maintenance Schedule',
        message: 'SEC_4 scheduled maintenance from 06:00 - 12:00',
        timestamp: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
      },
      {
        id: '5',
        type: 'success',
        title: 'Route Optimization',
        message: 'AI recommends rerouting TR005 via SEC_6 to avoid congestion',
        timestamp: new Date(Date.now() - 45 * 60 * 1000) // 45 minutes ago
      }
    ];

    setNotifications(sampleNotifications);
  }, [disruptions, trainData]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'error':
        return AlertCircle;
      case 'warning':
        return AlertTriangle;
      case 'success':
        return CheckCircle;
      case 'info':
      default:
        return Info;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'border-l-red-500 bg-red-50/80';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50/80';
      case 'success':
        return 'border-l-green-500 bg-green-50/80';
      case 'info':
      default:
        return 'border-l-blue-500 bg-blue-50/80';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    return timestamp.toLocaleDateString();
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="card-futuristic w-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              Notifications
              {notifications.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium"
                >
                  {notifications.length}
                </motion.span>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {notifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center text-gray-500 py-8"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-4xl mb-2"
                  >
                    📭
                  </motion.div>
                  <p className="font-medium">No new notifications</p>
                </motion.div>
              ) : (
                notifications.map((notification) => {
                  const IconComponent = getNotificationIcon(notification.type);
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`border-l-4 p-4 rounded-r-lg transition-all hover:shadow-md relative group ${getNotificationColor(notification.type)}`}
                    >
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/10 rounded-full"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <motion.div
                            animate={notification.type === 'error' ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                            transition={{ duration: 2, repeat: notification.type === 'error' ? Infinity : 0 }}
                          >
                            <IconComponent className="w-5 h-5 mt-0.5 text-gray-700" />
                          </motion.div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>

          {notifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2 font-medium"
                onClick={() => setNotifications([])}
              >
                <Trash2 className="w-4 h-4" />
                Clear all notifications
              </motion.button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Notifications;