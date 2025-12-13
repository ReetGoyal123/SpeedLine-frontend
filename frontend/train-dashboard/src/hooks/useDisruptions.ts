import useSWR from 'swr';
import { axiosInstance } from '@/lib/api';
import { Disruption } from '@/types';
import { mockDisruptions } from '@/lib/mockData';

const fetcher = async (url: string) => {
  try {
    const response = await axiosInstance.get(url);
    // Backend returns { active_disruptions: {}, affected_sections: number, timestamp: string }
    const backendData = response.data;
    
    // Transform backend disruption format to frontend format
    const disruptions: Disruption[] = [];
    
    if (backendData.active_disruptions) {
      Object.entries(backendData.active_disruptions).forEach(([sectionId, disruptionData]: [string, any]) => {
        disruptions.push({
          section_id: sectionId,
          type: disruptionData.type || 'maintenance',
          severity: disruptionData.severity || 'medium',
          start_time: disruptionData.start_time,
          estimated_end_time: disruptionData.end_time,
          description: `${disruptionData.type?.replace('_', ' ').toUpperCase() || 'Maintenance'} in section ${sectionId} - Duration: ${disruptionData.duration_minutes || 'Unknown'} minutes`,
          affected_trains: [] // Backend doesn't provide this directly, would need to calculate
        });
      });
    }
    
    return disruptions;
  } catch (error) {
    console.warn('Disruptions API call failed, using mock data');
    throw error;
  }
};

export const useDisruptions = (refreshInterval = 60000) => { // Changed default to 60 seconds to avoid conflicts
  const { data, error, mutate, isLoading } = useSWR<Disruption[]>(
    '/api/disruptions',
    fetcher,
    {
      refreshInterval,
      fallbackData: mockDisruptions,
      onError: (err: any) => {
        console.warn('Disruptions data fetch failed:', err.message);
      },
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  return {
    disruptions: data || mockDisruptions,
    isLoading,
    isError: error,
    mutate,
  };
};

export default useDisruptions;