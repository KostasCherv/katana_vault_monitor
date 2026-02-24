import dotenv from 'dotenv';
import { AppConfig } from '../types';

dotenv.config();

const parseDatabaseUrl = (url: string) => {
  const regex = /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
  const match = url.match(regex);
  
  if (!match) {
    throw new Error('Invalid DATABASE_URL format');
  }
  
  return {
    user: match[1]!,
    password: match[2]!,
    host: match[3]!,
    port: parseInt(match[4]!, 10),
    database: match[5]!,
  };
};

export const config: AppConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  database: parseDatabaseUrl(process.env.DATABASE_URL || 'postgresql://localhost:5432/vaultbridge_db'),
  katanaRpcUrl: process.env.KATANA_RPC_URL || 'https://rpc.katana.network',
  katanaChainId: parseInt(process.env.KATANA_CHAIN_ID || '747474', 10),

  logLevel: process.env.LOG_LEVEL || 'info',
};

export const validateConfig = (): void => {
  const requiredFields = [
    'DATABASE_URL',
    'KATANA_RPC_URL',
    'KATANA_CHAIN_ID',
  ];

  for (const field of requiredFields) {
    if (!process.env[field]) {
      throw new Error(`Missing required environment variable: ${field}`);
    }
  }
}; 