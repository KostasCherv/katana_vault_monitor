import axios from 'axios';
import type { AggregateResponse, EventsResponse, DateRange } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    if (error.response?.status === 404) {
      throw new Error('Data not found');
    }
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    throw new Error(error.response?.data?.error || 'An unexpected error occurred');
  }
);

export const vaultBridgeApi = {
  // Get aggregated data for charts
  getAggregateData: async (dateRange: DateRange): Promise<AggregateResponse> => {
    const params = new URLSearchParams({
      from: dateRange.from.toISOString(),
      to: dateRange.to.toISOString(),
    });
    
    const response = await api.get(`/api/vaultbridge/events/aggregate?${params}`);
    return response.data;
  },

  // Get events with pagination and filtering
  getEvents: async (params: {
    asset?: string;
    eventType?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<EventsResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params.asset) queryParams.append('asset', params.asset);
    if (params.eventType) queryParams.append('eventType', params.eventType);
    if (params.from) queryParams.append('from', params.from);
    if (params.to) queryParams.append('to', params.to);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    const response = await api.get(`/api/vaultbridge/events?${queryParams}`);
    return response.data;
  },

  // Health check
  getHealth: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api; 