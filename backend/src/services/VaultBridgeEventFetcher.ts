import { ethers, EventLog } from 'ethers';
import { TRACKED_ASSETS } from '../config/assets';
import { VaultBridgeEventRepository } from '../repositories/VaultBridgeEventRepository';
import { config } from '../config';
import logger from '../utils/logger';

const ABI = [
  'event Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares)',
  'event Withdraw(address indexed sender, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)',
];

const MAX_RETRIES = 3;
const CIRCUIT_BREAKER_THRESHOLD = 5;
const CIRCUIT_BREAKER_TIMEOUT = 60 * 1000; // 1 minute

export class VaultBridgeEventFetcher {
  private provider: ethers.JsonRpcProvider;
  private repo: VaultBridgeEventRepository;
  private failureCount = 0;
  private circuitOpen = false;
  private circuitTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(config.katanaRpcUrl);
    this.repo = new VaultBridgeEventRepository();
  }

  async fetchAndStoreEvents(fromBlock: number, toBlock: number): Promise<void> {
    if (this.circuitOpen) {
      logger.warn('Circuit breaker is open. Skipping fetch to avoid hammering the RPC.');
      return;
    }
    for (const asset of TRACKED_ASSETS) {
      const contract = new ethers.Contract(asset.contractAddress, ABI, this.provider);
      // Deposit events
      await this.fetchWithRetry(async () => {
        const depositFilter = contract.filters.Deposit?.();
        let depositCount = 0;
        if (depositFilter) {
          const depositEvents = await contract.queryFilter(depositFilter, fromBlock, toBlock);
          depositCount = depositEvents.length;
          if (depositCount > 0) {
            logger.info(`[${asset.symbol}] Fetched ${depositCount} deposit events from block ${fromBlock} to ${toBlock}`);
          } else {
            logger.info(`[${asset.symbol}] No deposit events found from block ${fromBlock} to ${toBlock}`);
          }
          for (const event of depositEvents) {
            const e = event as EventLog;
            const block = await this.provider.getBlock(e.blockNumber);
            if (!block) throw new Error('Block not found');
            await this.repo.insertEvent({
              asset: asset.symbol,
              eventType: 'deposit',
              txHash: e.transactionHash,
              logIndex: e.index,
              blockNumber: e.blockNumber,
              eventTimestamp: new Date(block.timestamp * 1000),
              sender: e.args.sender,
              receiver: null,
              owner: e.args.owner,
              assets: e.args.assets.toString(),
              shares: e.args.shares.toString(),
            });
          }
        }
      }, `[${asset.symbol}] Deposit fetch`);
      // Withdraw events
      await this.fetchWithRetry(async () => {
        const withdrawFilter = contract.filters.Withdraw?.();
        let withdrawCount = 0;
        if (withdrawFilter) {
          const withdrawEvents = await contract.queryFilter(withdrawFilter, fromBlock, toBlock);
          withdrawCount = withdrawEvents.length;
          if (withdrawCount > 0) {
            logger.info(`[${asset.symbol}] Fetched ${withdrawCount} withdraw events from block ${fromBlock} to ${toBlock}`);
          } else {
            logger.info(`[${asset.symbol}] No withdraw events found from block ${fromBlock} to ${toBlock}`);
          }
          for (const event of withdrawEvents) {
            const e = event as EventLog;
            const block = await this.provider.getBlock(e.blockNumber);
            if (!block) throw new Error('Block not found');
            await this.repo.insertEvent({
              asset: asset.symbol,
              eventType: 'withdraw',
              txHash: e.transactionHash,
              logIndex: e.index,
              blockNumber: e.blockNumber,
              eventTimestamp: new Date(block.timestamp * 1000),
              sender: e.args.sender,
              receiver: e.args.receiver,
              owner: e.args.owner,
              assets: e.args.assets.toString(),
              shares: e.args.shares.toString(),
            });
          }
        }
      }, `[${asset.symbol}] Withdraw fetch`);
    }
  }

  private async fetchWithRetry(fn: () => Promise<void>, context: string): Promise<void> {
    let attempt = 0;
    while (attempt < MAX_RETRIES) {
      try {
        await fn();
        this.failureCount = 0;
        return;
      } catch (error) {
        attempt++;
        this.failureCount++;
        logger.error(`${context} failed (attempt ${attempt}): ${error}`);
        if (this.failureCount >= CIRCUIT_BREAKER_THRESHOLD) {
          this.openCircuit();
          break;
        }
        if (attempt < MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
  }

  private openCircuit() {
    if (!this.circuitOpen) {
      logger.error('Circuit breaker triggered: too many consecutive failures. Pausing fetches.');
      this.circuitOpen = true;
      this.circuitTimeout = setTimeout(() => {
        this.circuitOpen = false;
        this.failureCount = 0;
        logger.warn('Circuit breaker closed. Resuming fetches.');
      }, CIRCUIT_BREAKER_TIMEOUT);
    }
  }
} 