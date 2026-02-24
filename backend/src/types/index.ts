export interface VaultBridgeAsset {
  name: string;
  symbol: string;
  contractAddress: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  database: DatabaseConfig;
  katanaRpcUrl: string;
  katanaChainId: number;
  logLevel: string;
} 