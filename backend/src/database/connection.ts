import { Pool, PoolClient } from 'pg';
import { config } from '../config';

const POOL_MAX = parseInt(process.env.DB_POOL_MAX || '20', 10);
const POOL_IDLE_TIMEOUT = parseInt(process.env.DB_POOL_IDLE_TIMEOUT || '30000', 10);
const POOL_CONN_TIMEOUT = parseInt(process.env.DB_POOL_CONN_TIMEOUT || '2000', 10);

//
// DB pool settings can be configured via env:
//   DB_POOL_MAX (default: 20)
//   DB_POOL_IDLE_TIMEOUT (ms, default: 30000)
//   DB_POOL_CONN_TIMEOUT (ms, default: 2000)
//

class DatabaseConnection {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: config.database.host,
      port: config.database.port,
      database: config.database.database,
      user: config.database.user,
      password: config.database.password,
      max: POOL_MAX,
      idleTimeoutMillis: POOL_IDLE_TIMEOUT,
      connectionTimeoutMillis: POOL_CONN_TIMEOUT,
    });

    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }

  async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  async query(text: string, params?: unknown[]): Promise<any> {
    const client = await this.getClient();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

export const db = new DatabaseConnection(); 