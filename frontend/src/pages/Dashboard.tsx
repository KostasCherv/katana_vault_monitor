import React, { useState } from 'react';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import { SummaryCards } from '../components/SummaryCards/SummaryCards';
import { useAggregateData } from '../hooks/useAggregateData';
import { DailyFlowChart } from '../components/Charts/DailyFlowChart';
import { NetFlowBarChart } from '../components/Charts/NetFlowBarChart';
import { EventCountBarChart } from '../components/Charts/EventCountBarChart';
import { FilterCard } from '../components/FilterCard/FilterCard';
import type { DateRange, AssetAggregate } from '../types';

export const Dashboard: React.FC = () => {
  // Default to ETH
  const [selectedAsset, setSelectedAsset] = useState<string>('yvvbETH');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfDay(subDays(new Date(), 14)),
    to: endOfDay(new Date()),
  });

  const { data, isLoading, error } = useAggregateData(dateRange);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Failed to load data: {error.message}
      </Alert>
    );
  }

  if (!data?.data?.assets) {
    return (
      <Alert severity="info" sx={{ mb: 3 }}>
        No data available for the selected date range.
      </Alert>
    );
  }

  // Only show the selected asset's data
  const filteredAssets: AssetAggregate[] = data.data.assets.filter((a) => a.asset === selectedAsset);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        VaultBridge Dashboard
      </Typography>
      <FilterCard
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        asset={selectedAsset}
        onAssetChange={setSelectedAsset}
      />
      <SummaryCards assets={filteredAssets} />
      <Box sx={{ mt: 4 }}>
        <DailyFlowChart assets={filteredAssets} />
      </Box>
      <Box sx={{ mt: 4 }}>
        <NetFlowBarChart assets={filteredAssets} />
      </Box>
      <Box sx={{ mt: 4 }}>
        <EventCountBarChart assets={filteredAssets} />
      </Box>
    </Box>
  );
}; 