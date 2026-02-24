import { ethers } from 'ethers';
import { VaultBridgeEventFetcher } from '../services/VaultBridgeEventFetcher';
import { VaultBridgeEventRepository } from '../repositories/VaultBridgeEventRepository';
import { config } from '../config';

export class EventFetcherJob {
  private eventFetcher: VaultBridgeEventFetcher;
  private eventRepo: VaultBridgeEventRepository;
  private provider: ethers.JsonRpcProvider;
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  private readonly FETCH_INTERVAL = 30 * 1000; // 30 seconds
  private readonly STARTING_BLOCK = 5000000;
  private readonly BATCH_SIZE = 1000; // Fetch 100 blocks at a time
  private lastProcessedBlock: number = 5000000 - 1; // Track the last processed block

  constructor() {
    this.eventFetcher = new VaultBridgeEventFetcher();
    this.eventRepo = new VaultBridgeEventRepository();
    this.provider = new ethers.JsonRpcProvider(config.katanaRpcUrl);
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('Event fetcher job is already running');
      return;
    }

    this.isRunning = true;
    console.log('Starting event fetcher job...');

    // Initialize last processed block from database
    await this.initializeLastProcessedBlock();

    // Start the periodic fetching
    this.intervalId = setInterval(async () => {
      await this.fetchEvents();
    }, this.FETCH_INTERVAL);

    // Run initial fetch
    await this.fetchEvents();
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log('Event fetcher job stopped');
  }

  private async fetchEvents(): Promise<void> {
    try {
      const latestBlock = await this.provider.getBlockNumber();
      const fromBlock = this.lastProcessedBlock + 1;

      if (fromBlock > latestBlock) {
        console.log('No new blocks to fetch');
        return;
      }

      // Fetch in batches to avoid RPC limits
      const toBlock = Math.min(fromBlock + this.BATCH_SIZE - 1, latestBlock);

      console.log(`Fetching events from block ${fromBlock} to ${toBlock} (latest: ${latestBlock})`);
      
      await this.eventFetcher.fetchAndStoreEvents(fromBlock, toBlock);
      
      // Update the last processed block regardless of whether events were found
      this.lastProcessedBlock = toBlock;
      
      console.log(`Successfully processed blocks ${fromBlock} to ${toBlock}`);
    } catch (error) {
      console.error('Error in event fetcher job:', error);
    }
  }

  private async initializeLastProcessedBlock(): Promise<void> {
    try {
      const latestBlock = await this.eventRepo.getLatestBlockNumber();
      this.lastProcessedBlock = latestBlock || this.STARTING_BLOCK - 1;
      console.log(`Initialized last processed block to: ${this.lastProcessedBlock}`);
    } catch (error) {
      console.error('Error initializing last processed block:', error);
      this.lastProcessedBlock = this.STARTING_BLOCK - 1;
    }
  }

  async runNow(): Promise<void> {
    console.log('Running event fetcher manually...');
    await this.fetchEvents();
    console.log('Manual event fetch completed');
  }
} 