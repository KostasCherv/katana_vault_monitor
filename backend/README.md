# 🗡️ Katana VaultBridge Backend

A Node.js + Express API that monitors VaultBridge inflow and outflow data for tracked assets on the Katana network.

## 🎯 Features

- **Real-time Monitoring**: Tracks daily inflow and outflow for VaultBridge assets
- **RESTful API**: Clean API endpoints for data retrieval
- **Automated Data Collection**: Daily cron job for data fetching
- **PostgreSQL Storage**: Robust database with proper indexing
- **TypeScript**: Full type safety and modern development experience
- **Production Ready**: Security middleware, error handling, and logging

## 📊 Tracked Assets

| Asset Name | Symbol   | Contract Address                                   |
|------------|----------|----------------------------------------------------|
| VaultBridge Token | vbToken | 0xE007CA01894c863d7898045ed5A3B4Abf0b18f37         |
| WETH       | vbETH    | 0xEE7D8BCFb72bC1880D0Cf19822eB0A2e6577aB62         |
| WBTC       | vbWBTC   | 0x0913DA6Da4b42f538B445599b46Bb4622342Cf52         |
| USDC       | vbUSDC   | 0x203A662b0BD271A6ed5a60EdFbd04bFce608FD36         |
| USDT       | vbUSDT   | 0x2DCa96907fde857dd3D816880A0df407eeB2D2F2         |
| USDS       | vbUSDS   | 0x62D6A123E8D19d06d86cf0d2294F9A3A0362c6b3         |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- Katana RPC endpoint

### Installation

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Set up database**
   ```bash
   # Create PostgreSQL database
   createdb vaultbridge_db
   
   # Run migrations
   npm run db:migrate
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## ⚙️ Configuration

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/vaultbridge_db

# Blockchain Configuration
KATANA_RPC_URL=https://rpc.katana.network
KATANA_CHAIN_ID=747474

# VaultBridge Configuration


# Logging
LOG_LEVEL=info
```

**Note**: The backend automatically handles proxy contracts by fetching the implementation address from the proxy contract.

## 📡 API Endpoints

### Health Check
```
GET /health
```
Returns server status and timestamp.

### Get Events
```
GET /api/vaultbridge/events
```
Returns raw Deposit/Withdraw events with optional filtering.

**Query Parameters:**
- `asset`: Filter by asset symbol (e.g., yvvbETH)
- `eventType`: Filter by event type (deposit/withdraw)
- `from`: Filter events from date (ISO string)
- `to`: Filter events up to date (ISO string)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "asset": "yvvbETH",
      "eventType": "deposit",
      "txHash": "0x...",
      "blockNumber": 5000000,
      "eventTimestamp": "2024-01-01T00:00:00.000Z",
      "sender": "0x...",
      "owner": "0x...",
      "assets": "1000000000000000000",
      "shares": "1000000000000000000"
    }
  ]
}
```

### Get Daily Aggregates
```
GET /api/vaultbridge/events/aggregate
```
Returns daily aggregated inflow/outflow data for all assets (defaults to past 14 days).

**Query Parameters:**
- `from`: Start date (ISO string, default: 14 days ago)
- `to`: End date (ISO string, default: now)

**Response:**
```json
{
  "success": true,
  "data": {
    "period": {
      "from": "2024-01-01T00:00:00.000Z",
      "to": "2024-01-15T00:00:00.000Z"
    },
    "assets": [
      {
        "asset": "yvvbETH",
        "total_deposits": 5000000000000000000,
        "total_withdrawals": 2000000000000000000,
        "total_deposit_events": 25,
        "total_withdrawal_events": 10,
        "daily_data": [
          {
            "date": "2024-01-15T00:00:00.000Z",
            "deposits": 1000000000000000000,
            "withdrawals": 500000000000000000,
            "deposit_events": 5,
            "withdrawal_events": 2
          }
        ]
      }
    ]
  }
}
```

## 🗄️ Database Schema

### `vaultbridge_events` Table

| Column           | Type       | Description                          |
|------------------|------------|--------------------------------------|
| id               | UUID       | Primary key                          |
| asset            | TEXT       | Asset symbol (e.g., 'yvvbETH')       |
| event_type       | TEXT       | Event type ('deposit' or 'withdraw') |
| tx_hash          | TEXT       | Transaction hash                     |
| log_index        | INTEGER    | Log index in transaction             |
| block_number     | INTEGER    | Block number                         |
| event_timestamp  | TIMESTAMP  | Event timestamp                      |
| sender           | TEXT       | Event sender address                 |
| receiver         | TEXT       | Event receiver address               |
| owner            | TEXT       | Event owner address                  |
| assets           | NUMERIC    | Assets amount                        |
| shares           | NUMERIC    | Shares amount                        |
| created_at       | TIMESTAMP  | Record creation time                 |

## 🏗️ Architecture

```
src/
├── config/           # Configuration management
├── controllers/      # Request handlers
├── database/         # Database connection and schema
├── jobs/            # Scheduled tasks
├── middleware/      # Express middleware
├── repositories/    # Data access layer
├── routes/          # API route definitions
├── services/        # Business logic
├── types/           # TypeScript type definitions
```


## 📦 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:migrate` - Run database migrations

## 🔧 Development

### Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

### Adding New Assets

1. Add the asset to `src/config/assets.ts`
2. Update the database schema if needed
3. Update documentation

### Adding New Endpoints

1. Create controller method in `src/controllers/`
2. Add route in `src/routes/`
3. Update API documentation

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For questions or issues, please open a GitHub issue or contact the development team. 