import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  trend
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white border border-gray-100 shadow-sm h-full hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          {icon && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-2 bg-gray-50 rounded-lg"
            >
              {icon}
            </motion.div>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            {value}
          </motion.div>
          {description && (
            <p className="text-sm text-gray-500">
              {description}
            </p>
          )}
          {trend && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex items-center mt-3"
            >
              <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${
                trend.isPositive
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}>
                {trend.isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(trend.value)}%
              </div>
              <span className="text-xs text-gray-400 ml-2">from last hour</span>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;