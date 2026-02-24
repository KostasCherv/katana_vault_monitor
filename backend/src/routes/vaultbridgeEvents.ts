import { Router } from 'express';
import { VaultBridgeEventRepository } from '../repositories/VaultBridgeEventRepository';
import { VaultBridgeEventFetcher } from '../services/VaultBridgeEventFetcher';

const router = Router();
const repo = new VaultBridgeEventRepository();
const eventFetcher = new VaultBridgeEventFetcher();

// GET /api/vaultbridge/events - list events with optional filters and pagination
router.get('/', async (req, res) => {
  const { asset, eventType, from, to, page = '1', limit = '20' } = req.query;
  
  // Parse pagination parameters
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const offset = (pageNum - 1) * limitNum;
  
  // Only pass 'from' and 'to' if they are defined
  const filter: any = {
    asset: asset ? (asset as string) : undefined,
    eventType: eventType ? (eventType as string) : undefined,
  };
  if (from) filter.from = new Date(from as string);
  if (to) filter.to = new Date(to as string);
  
  try {
    const { events, total } = await repo.getEventsPaginated(filter, limitNum, offset);
    
    res.json({ 
      success: true, 
      data: events,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error getting events:', error);
    res.status(500).json({ success: false, error: 'Failed to get events' });
  }
});

// GET /api/vaultbridge/events/aggregate - daily inflow/outflow aggregation by asset
router.get('/aggregate', async (req, res) => {
  const { from, to } = req.query;
  // Default to past week (7 days)
  const fromDate = from ? new Date(from as string) : new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const toDate = to ? new Date(to as string) : new Date();
  
  try {
    const rawAggregates = await repo.getAllAssetsDailyAggregates(fromDate, toDate);
    
    // Structure the response by asset
    const structuredData: any = {};
    
    rawAggregates.forEach((row: any) => {
      const asset = row.asset;
      const day = row.day;
      const eventType = row.event_type;
      
      if (!structuredData[asset]) {
        structuredData[asset] = {
          asset,
          total_deposits: 0,
          total_withdrawals: 0,
          total_deposit_events: 0,
          total_withdrawal_events: 0,
          daily_data: {}
        };
      }
      
      if (!structuredData[asset].daily_data[day]) {
        structuredData[asset].daily_data[day] = {
          date: day,
          deposits: 0,
          withdrawals: 0,
          deposit_events: 0,
          withdrawal_events: 0
        };
      }
      
      if (eventType === 'deposit') {
        structuredData[asset].total_deposits += parseFloat(row.total_assets);
        structuredData[asset].total_deposit_events += parseInt(row.event_count);
        structuredData[asset].daily_data[day].deposits += parseFloat(row.total_assets);
        structuredData[asset].daily_data[day].deposit_events += parseInt(row.event_count);
      } else if (eventType === 'withdraw') {
        structuredData[asset].total_withdrawals += parseFloat(row.total_assets);
        structuredData[asset].total_withdrawal_events += parseInt(row.event_count);
        structuredData[asset].daily_data[day].withdrawals += parseFloat(row.total_assets);
        structuredData[asset].daily_data[day].withdrawal_events += parseInt(row.event_count);
      }
    });
    
    // Convert daily_data objects to arrays and sort by date
    Object.values(structuredData).forEach((assetData: any) => {
      assetData.daily_data = Object.values(assetData.daily_data).sort((a: any, b: any) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });
    
    const response = {
      success: true,
      data: {
        period: {
          from: fromDate.toISOString(),
          to: toDate.toISOString()
        },
        assets: Object.values(structuredData)
      }
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error getting aggregates:', error);
    res.status(500).json({ success: false, error: 'Failed to get aggregates' });
  }
});

// POST /api/vaultbridge/events/fetch - trigger event fetching from a specific block
router.post('/fetch', async (req, res) => {
  try {
    const { fromBlock, toBlock } = req.body;
    
    if (!fromBlock || !toBlock) {
      return res.status(400).json({ 
        success: false, 
        error: 'fromBlock and toBlock are required' 
      });
    }

    console.log(`Starting event fetch from block ${fromBlock} to ${toBlock}`);
    
    await eventFetcher.fetchAndStoreEvents(fromBlock, toBlock);
    
    return res.json({ 
      success: true, 
      message: `Successfully fetched events from block ${fromBlock} to ${toBlock}` 
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch events' 
    });
  }
});

export default router; 