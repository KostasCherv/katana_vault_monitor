import { useQuery } from '@tanstack/react-query';
import { vaultBridgeApi } from '../services/api';

interface UseEventsParams {
  asset?: string;
  eventType?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export const useEvents = (params: UseEventsParams = {}) => {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => vaultBridgeApi.getEvents(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}; 