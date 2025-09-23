import useSWR from 'swr';
import { axiosInstance } from '@/lib/api';
import { HealthResponse } from '@/types';
import { mockHealthData } from '@/lib/mockData';

const fetcher = async (url: string) => {
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.warn('Health API call failed, using mock data');
    throw error;
  }
};

export const useHealthData = (refreshInterval = 60000) => { // Changed to 60 seconds to avoid conflicts with optimization engine
  const { data, error, mutate, isLoading } = useSWR<HealthResponse>(
    '/health',
    fetcher,
    {
      refreshInterval,
      fallbackData: mockHealthData,
      onError: (err: any) => {
        console.warn('Health data fetch failed:', err.message);
      },
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  return {
    healthData: data || mockHealthData,
    isLoading,
    isError: error,
    mutate,
  };
};

export default useHealthData;