# 📙 Backend Spec – Katana VaultBridge Event Monitor

## Overview
A minimal Node.js + Express API that fetches and stores all Deposit/Withdraw events for VaultBridge yVault assets on the Katana network. Data is stored in PostgreSQL and served via a REST API. Aggregation is performed on-demand from raw events.

---

## 🎯 Tracked Assets & Addresses

| Asset Name      | Symbol     | Contract Address                                   |
|-----------------|------------|----------------------------------------------------|
| vbETH yVault    | yvvbETH    | 0xE007CA01894c863d7898045ed5A3B4Abf0b18f37         |
| vbUSDC yVault   | yvvbUSDC   | 0x80c34BD3A3569E126e7055831036aa7b212cB159         |
| vbUSDT yVault   | yvvbUSDT   | 0x9A6bd7B6Fd5C4F87eb66356441502fc7dCdd185B         |
| vbWBTC yVault   | yvvbWBTC   | 0xAa0362eCC584B985056E47812931270b99C91f9d         |

---

## 🧱 Database Schema

### Table: `vaultbridge_events`

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

#### Indexes
- `idx_vaultbridge_events_asset` (asset)
- `idx_vaultbridge_events_event_type` (event_type)
- `idx_vaultbridge_events_event_timestamp` (event_timestamp)
- `idx_vaultbridge_events_asset_type_time` (asset, event_type, event_timestamp)
- `idx_vaultbridge_events_block_number` (block_number)
- `idx_vaultbridge_events_tx_hash` (tx_hash)

---

## 🔌 REST API Endpoints

### `GET /api/vaultbridge/events`
Returns raw Deposit/Withdraw events with optional filtering.

**Query Parameters:**
- `asset`: Filter by asset symbol (e.g., yvvbETH)
- `eventType`: Filter by event type (deposit/withdraw)
- `from`: Filter events from date (ISO string)
- `to`: Filter events up to date (ISO string)

### `GET /api/vaultbridge/events/aggregate`
Returns daily aggregated inflow/outflow data for all assets (defaults to past 14 days).

**Query Parameters:**
- `from`: Start date (ISO string, default: 14 days ago)
- `to`: End date (ISO string, default: now)

**Response Example:**
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

---

## ⚙️ Minimal Architecture
- Node.js + Express backend
- PostgreSQL for storage
- ethers.js for on-chain event fetching
- Background event fetcher job (interval, batch, and start block configurable)
- Winston for structured logging

---

## 🪵 Logging & Error Handling
- All logs and errors use a centralized Winston logger with timestamps and log levels.
- Event fetcher and repository log all errors with context.
- Event fetcher includes retry logic for RPC failures (3 attempts per call).
- Circuit breaker: If 5 consecutive failures occur, fetcher pauses for 1 minute before retrying.

---

## ⚙️ Configuration
- All configuration is via environment variables (see `env.example`).
- Database pool settings, RPC URL, chain ID, and logging level are configurable.

---

## 📋 Minimal Tasks
- Set up Express + TypeScript project
- Set up PostgreSQL and schema
- Add config for tracked assets
- Implement event fetcher for Deposit/Withdraw events
- Implement REST API endpoints for raw events and aggregation
- Add structured logging and error handling
- Document configuration and API
