import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config, validateConfig } from './config';
import vaultbridgeEventsRoutes from './routes/vaultbridgeEvents';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { EventFetcherJob } from './jobs/eventFetcherJob';
import { db } from './database/connection';
import { runMigrations } from './database/migrate';

class App {
  private app: express.Application;
  private eventFetcherJob: EventFetcherJob;

  constructor() {
    this.app = express();
    this.eventFetcherJob = new EventFetcherJob();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS middleware
    this.app.use(cors());
    
    // Logging middleware
    if (config.nodeEnv === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }
    
    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // API routes
    this.app.use('/api/vaultbridge/events', vaultbridgeEventsRoutes);
  }

  private setupErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);
    
    // Global error handler
    this.app.use(errorHandler);
  }

  async start(): Promise<void> {
    try {
      // Validate configuration
      validateConfig();
      
      // Start the event fetcher job
      await this.eventFetcherJob.start();
      
      // Start the server
      this.app.listen(config.port, () => {
        console.log(`🚀 VaultBridge Backend running on port ${config.port}`);
        console.log(`📊 Environment: ${config.nodeEnv}`);
        console.log(`🔗 Health check: http://localhost:${config.port}/health`);
        console.log(`📈 API: http://localhost:${config.port}/api/vaultbridge`);
      });
    } catch (error) {
      console.error('Failed to start application:', error);
      process.exit(1);
    }
  }

  async stop(): Promise<void> {
    try {
      await this.eventFetcherJob.stop();
      await db.close();
      console.log('Application stopped gracefully');
    } catch (error) {
      console.error('Error stopping application:', error);
    }
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  const app = new App();
  await app.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  const app = new App();
  await app.stop();
  process.exit(0);
});

// Start the application
runMigrations().catch((error) => {
  console.error('Failed to run migrations:', error);
  process.exit(1);
}).then(() => {
  console.log('Migrations completed successfully');
  const app = new App();
  app.start().catch((error) => {
    console.error('Failed to start application:', error);
    process.exit(1);
  });
}); 