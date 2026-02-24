export interface VaultBridgeAsset {
  name: string;
  symbol: string;
  contractAddress: string;
}

export interface VaultBridgeEvent {
  id: string;
  asset: string;
  event_type: 'deposit' | 'withdraw';
  tx_hash: string;
  log_index: number;
  block_number: number;
  event_timestamp: string;
  sender: string | null;
  receiver: string | null;
  owner: string | null;
  assets: string;
  shares: string | null;
  created_at: string;
}

export interface DailyData {
  date: string;
  deposits: number;
  withdrawals: number;
  deposit_events: number;
  withdrawal_events: number;
}

export interface AssetAggregate {
  asset: string;
  total_deposits: number;
  total_withdrawals: number;
  total_deposit_events: number;
  total_withdrawal_events: number;
  daily_data: DailyData[];
}

export interface AggregateResponse {
  success: boolean;
  data: {
    period: {
      from: string;
      to: string;
    };
    assets: AssetAggregate[];
  };
}

export interface EventsResponse {
  success: boolean;
  data: VaultBridgeEvent[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  error: string;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface ChartDataPoint {
  date: string;
  deposits: number;
  withdrawals: number;
  netFlow: number;
  depositEvents: number;
  withdrawalEvents: number;
  totalEvents: number;
}

export interface SummaryStats {
  totalVolume: number;
  totalEvents: number;
  netFlow: number;
  mostActiveAsset: string;
  latestEventTimestamp: string;
} 