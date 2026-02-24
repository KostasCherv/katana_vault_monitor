# VaultBridge Frontend

A React + Material UI application for monitoring VaultBridge inflow/outflow metrics on the Katana network.

## Features

- **Dashboard**: Real-time charts and summary statistics
- **Events Table**: Detailed view of all deposit/withdrawal events
- **Date Range Filtering**: Customizable time periods with preset options
- **Responsive Design**: Mobile-friendly interface
- **Dark Mode**: Toggle between light and dark themes

## Tech Stack

- **React 19** with TypeScript
- **Material UI v7** for components and theming
- **Recharts** for data visualization
- **React Query** for data fetching and caching
- **React Router** for navigation
- **Axios** for HTTP requests
- **date-fns** for date handling

## Getting Started

### Prerequisites

- Node.js 20+ 
- Backend server running on `http://localhost:3000`

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Charts/         # Chart components
│   ├── Layout/         # Layout components
│   ├── DateRangeSelector/
│   └── SummaryCards/
├── config/             # Configuration files
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API services
├── theme/              # Material UI theme
├── types/              # TypeScript interfaces
└── utils/              # Utility functions
```

## API Integration

The frontend connects to the VaultBridge backend API:

- `GET /api/vaultbridge/events/aggregate` - Main data source for charts
- `GET /api/vaultbridge/events` - Events data for the table
- `GET /health` - Health check endpoint

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Current Status

✅ **Completed:**
- Project setup with Vite + React + TypeScript
- Material UI theme and components
- API service layer with React Query
- Dashboard with summary cards
- Date range selector
- Basic daily flow chart
- Navigation and routing
- Type definitions and utilities

🔄 **In Progress:**
- Events data grid with pagination
- Additional chart types (event count, net flow, asset comparison)
- Advanced filtering and search
- Export functionality

## Next Steps

1. Implement the Events data grid with Material UI DataGrid
2. Add more chart types (line charts, area charts)
3. Implement advanced filtering and search
4. Add export functionality
5. Optimize performance and add error boundaries
6. Add unit tests
