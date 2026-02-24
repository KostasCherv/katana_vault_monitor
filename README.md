# Katana VaultBridge Monitor

A full-stack application for monitoring VaultBridge inflow and outflow data on the Katana network.

## Project Structure

```
katana/
├── backend/          # Node.js + Express API
└── frontend/        # React + Material UI dashboard
```

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: PostgreSQL
- **Blockchain**: Ethers.js
- **Language**: TypeScript

### Frontend
- **Framework**: React + Vite
- **UI Library**: Material UI
- **Charts**: Recharts
- **Data Fetching**: React Query + Axios
- **Routing**: React Router

## Quick Start

### Backend

```bash
cd backend
npm install
cp env.example .env
# Configure your .env file
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Features

- **Dashboard**: View daily inflow/outflow charts and summary statistics
- **Events Table**: Browse detailed events with filtering, sorting, and search
- **Multiple Charts**: Bar charts, line charts, and net flow visualization
- **Date Filtering**: Filter data by custom date ranges (7d, 14d, 30d, 90d)
- **Dark Mode**: Toggle between light and dark themes

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check |
| `GET /api/vaultbridge/events` | Raw events with filtering |
| `GET /api/vaultbridge/events/aggregate` | Daily aggregated data |

## Tracked Assets

| Asset | Symbol |
|-------|--------|
| vbETH yVault | yvvbETH |
| vbUSDC yVault | yvvbUSDC |
| vbUSDT yVault | yvvbUSDT |
| vbWBTC yVault | yvvbWBTC |

## Scripts

### Backend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run db:migrate` - Run database migrations

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run linter
