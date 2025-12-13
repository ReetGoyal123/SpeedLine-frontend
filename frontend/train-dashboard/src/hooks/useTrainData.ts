import useSWR from 'swr';
import { axiosInstance } from '@/lib/api';
import { TrainBundle } from '@/types';
import { mockTrainData } from '@/lib/mockData';

const fetcher = async (url: string) => {
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.warn('API call failed, using mock data');
    throw error;
  }
};

export const useTrainData = (refreshInterval = 30000) => { // Reduced to 30 seconds to avoid conflicts with optimization engine
  const { data, error, mutate, isLoading } = useSWR<{ payload: TrainBundle[] }>(
    '/api/train-data',
    fetcher,
    {
      refreshInterval,
      fallbackData: { payload: mockTrainData },
      onError: (err) => {
        console.warn('Train data fetch failed:', err.message);
      },
      errorRetryCount: 2,
      errorRetryInterval: 10000,
    }
  );

  return {
    trainData: data?.payload || mockTrainData,
    isLoading,
    isError: error,
    mutate,
  };
};

export default useTrainData;