import useSWR from 'swr';
import { axiosInstance } from '@/lib/api';
import { OptimizationResult } from '@/types';

const fetcher = async (url: string) => {
  try {
    const response = await axiosInstance.get(url);
    // Backend returns { message: string, timestamp: string, data: {...} }
    const backendData = response.data;
    
    // Transform backend optimization format to frontend format
    const optimizationResults: OptimizationResult[] = [];
    
    if (backendData.data && backendData.data.schedule) {
      Object.entries(backendData.data.schedule).forEach(([trainId, scheduleData]: [string, any]) => {
        optimizationResults.push({
          train_id: trainId,
          action: scheduleData.action || 'proceed',
          timestamp: scheduleData.entry_epoch_s ? new Date(scheduleData.entry_epoch_s * 1000).toISOString() : undefined,
          new_route: scheduleData.target_section ? [scheduleData.target_section] : undefined,
          reason: `Priority ${scheduleData.priority || 1} train - ${scheduleData.status || 'scheduled'}`,
          priority_score: scheduleData.priority || 1
        });
      });
    }
    
    return optimizationResults;
  } catch (error) {
    console.warn('Optimization API call failed:', error);
    throw error;
  }
};

// Note: This hook is now used only for manual refresh since optimization logic is integrated in useOptimizationEngine
// No auto-refresh to avoid conflicts with the integrated optimization engine
export const useOptimizationResults = () => {
  const { data, error, mutate, isLoading } = useSWR<OptimizationResult[]>(
    '/api/optimization/results',
    fetcher,
    {
      refreshInterval: 0, // No auto-refresh - optimization engine handles this
      fallbackData: [],
      onError: (err: any) => {
        console.warn('Optimization data fetch failed:', err.message);
      },
      errorRetryCount: 2,
      errorRetryInterval: 10000,
      revalidateOnFocus: false, // Disable to avoid conflicts
      revalidateOnReconnect: false, // Disable to avoid conflicts
    }
  );

  const refreshOptimizationData = () => {
    mutate();
  };

  return {
    optimizationResults: data || [],
    isLoading,
    isError: error,
    refreshOptimizationData,
  };
};

export default useOptimizationResults;