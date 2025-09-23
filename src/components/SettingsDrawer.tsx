import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Settings {
  showDisruptions: boolean;
  showOptimizer: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  notifications: boolean;
}

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<Settings>({
    showDisruptions: true,
    showOptimizer: true,
    autoRefresh: true,
    refreshInterval: 15,
    notifications: true,
  });

  const handleSettingChange = (key: keyof Settings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform">
        <Card className="h-full rounded-none border-0">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Settings</CardTitle>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              
              {/* Display Settings */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  Display Options
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Show Disruptions
                      </label>
                      <p className="text-xs text-gray-500">
                        Display disruption overlays on the map
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.showDisruptions}
                        onChange={(e) => handleSettingChange('showDisruptions', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Show AI Optimizer
                      </label>
                      <p className="text-xs text-gray-500">
                        Display AI optimization suggestions
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.showOptimizer}
                        onChange={(e) => handleSettingChange('showOptimizer', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Data Settings */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  Data Refresh
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Auto-refresh Data
                      </label>
                      <p className="text-xs text-gray-500">
                        Automatically update train data
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoRefresh}
                        onChange={(e) => handleSettingChange('autoRefresh', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Refresh Interval (seconds)
                    </label>
                    <select
                      value={settings.refreshInterval}
                      onChange={(e) => handleSettingChange('refreshInterval', parseInt(e.target.value))}
                      disabled={!settings.autoRefresh}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value={10}>10 seconds</option>
                      <option value={15}>15 seconds</option>
                      <option value={20}>20 seconds</option>
                      <option value={30}>30 seconds</option>
                      <option value={60}>1 minute</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  Notifications
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Enable Notifications
                    </label>
                    <p className="text-xs text-gray-500">
                      Receive alerts for delays and disruptions
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications}
                      onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

            </div>
          </CardContent>
          
          {/* Footer */}
          <div className="border-t p-6">
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Settings saved:', settings);
                  onClose();
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Save Settings
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsDrawer;