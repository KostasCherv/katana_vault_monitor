import { useQuery } from '@tanstack/react-query';
import { vaultBridgeApi } from '../services/api';
import type { DateRange } from '../types';

export const useAggregateData = (dateRange: DateRange) => {
  return useQuery({
    queryKey: ['aggregate', dateRange.from.toISOString(), dateRange.to.toISOString()],
    queryFn: () => vaultBridgeApi.getAggregateData(dateRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}; 