import { db } from '../database/connection';
import { VaultBridgeAsset } from '../types';
import logger from '../utils/logger';

export interface VaultBridgeEvent {
  id: string;
  asset: string;
  eventType: 'deposit' | 'withdraw';
  txHash: string;
  logIndex: number;
  blockNumber: number;
  eventTimestamp: Date;
  sender: string | null;
  receiver: string | null;
  owner: string | null;
  assets: string;
  shares: string | null;
  createdAt: Date;
}

export class VaultBridgeEventRepository {
  async insertEvent(event: Omit<VaultBridgeEvent, 'id' | 'createdAt'>): Promise<void> {
    const query = `
      INSERT INTO vaultbridge_events
        (asset, event_type, tx_hash, log_index, block_number, event_timestamp, sender, receiver, owner, assets, shares)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (tx_hash, log_index) DO NOTHING
    `;
    try {
      await db.query(query, [
        event.asset,
        event.eventType,
        event.txHash,
        event.logIndex,
        event.blockNumber,
        event.eventTimestamp,
        event.sender,
        event.receiver,
        event.owner,
        event.assets,
        event.shares,
      ]);
    } catch (error) {
      logger.error('Error inserting event:', error);
      throw error;
    }
  }

  async getEvents({ asset, eventType, from, to }: { asset?: string | undefined; eventType?: string | undefined; from?: Date; to?: Date }): Promise<VaultBridgeEvent[]> {
    let query = 'SELECT * FROM vaultbridge_events WHERE 1=1';
    const params: any[] = [];
    let idx = 1;
    if (asset) {
      query += ` AND asset = $${idx++}`;
      params.push(asset);
    }
    if (eventType) {
      query += ` AND event_type = $${idx++}`;
      params.push(eventType);
    }
    if (from) {
      query += ` AND event_timestamp >= $${idx++}`;
      params.push(from);
    }
    if (to) {
      query += ` AND event_timestamp <= $${idx++}`;
      params.push(to);
    }
    query += ' ORDER BY event_timestamp DESC';
    try {
      const result = await db.query(query, params);
      return result.rows;
    } catch (error) {
      logger.error('Error fetching events:', error);
      throw error;
    }
  }

  async getEventsPaginated(
    { asset, eventType, from, to }: { asset?: string | undefined; eventType?: string | undefined; from?: Date; to?: Date },
    limit: number,
    offset: number
  ): Promise<{ events: VaultBridgeEvent[]; total: number }> {
    // Build the base WHERE clause
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let idx = 1;
    
    if (asset) {
      whereClause += ` AND asset = $${idx++}`;
      params.push(asset);
    }
    if (eventType) {
      whereClause += ` AND event_type = $${idx++}`;
      params.push(eventType);
    }
    if (from) {
      whereClause += ` AND event_timestamp >= $${idx++}`;
      params.push(from);
    }
    if (to) {
      whereClause += ` AND event_timestamp <= $${idx++}`;
      params.push(to);
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM vaultbridge_events ${whereClause}`;
    const countResult = await db.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total, 10);

    // Get paginated events
    const eventsQuery = `
      SELECT * FROM vaultbridge_events 
      ${whereClause}
      ORDER BY event_timestamp DESC 
      LIMIT $${idx++} OFFSET $${idx++}
    `;
    const eventsParams = [...params, limit, offset];
    const eventsResult = await db.query(eventsQuery, eventsParams);

    return {
      events: eventsResult.rows,
      total
    };
  }

  async getDailyAggregates(asset: string, from: Date, to: Date): Promise<any[]> {
    const query = `
      SELECT
        event_type,
        DATE_TRUNC('day', event_timestamp) AS day,
        SUM(assets::numeric) AS total_assets,
        COUNT(*) AS event_count
      FROM vaultbridge_events
      WHERE asset = $1 AND event_timestamp >= $2 AND event_timestamp <= $3
      GROUP BY event_type, day
      ORDER BY day DESC, event_type
    `;
    try {
      const result = await db.query(query, [asset, from, to]);
      return result.rows;
    } catch (error) {
      logger.error('Error fetching daily aggregates:', error);
      throw error;
    }
  }

  async getAllAssetsDailyAggregates(from: Date, to: Date): Promise<any[]> {
    const query = `
      SELECT
        asset,
        event_type,
        DATE_TRUNC('day', event_timestamp) AS day,
        SUM(assets::numeric) AS total_assets,
        COUNT(*) AS event_count
      FROM vaultbridge_events
      WHERE event_timestamp >= $1 AND event_timestamp <= $2
      GROUP BY asset, event_type, day
      ORDER BY asset, day DESC, event_type
    `;
    try {
      const result = await db.query(query, [from, to]);
      return result.rows;
    } catch (error) {
      logger.error('Error fetching all assets daily aggregates:', error);
      throw error;
    }
  }

  async getLatestBlockNumber(): Promise<number> {
    const query = 'SELECT MAX(block_number) as latest_block FROM vaultbridge_events';
    try {
      const result = await db.query(query);
      return result.rows[0]?.latest_block || 0;
    } catch (error) {
      logger.error('Error fetching latest block number:', error);
      throw error;
    }
  }
} 