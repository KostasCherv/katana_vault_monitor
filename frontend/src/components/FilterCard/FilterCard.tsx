import React from 'react';
import { Card, CardContent, Box, Typography, Stack, Divider } from '@mui/material';
import { DateRangeSelector } from '../DateRangeSelector/DateRangeSelector';
import { AssetSelector } from '../Charts/AssetSelector';
import type { DateRange } from '../../types';

interface FilterCardProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  asset: string;
  onAssetChange: (asset: string) => void;
}

export const FilterCard: React.FC<FilterCardProps> = ({ dateRange, onDateRangeChange, asset, onAssetChange }) => {
  return (
    <Card elevation={2} sx={{ mb: 3, borderRadius: 3 }}>
      <CardContent>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ md: 'center' }}>
          <Box flex={1}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Date Range
            </Typography>
            <DateRangeSelector dateRange={dateRange} onDateRangeChange={onDateRangeChange} />
          </Box>
          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, mx: 2 }} />
          <Box flexShrink={0} minWidth={200}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Asset Filter
            </Typography>
            <AssetSelector asset={asset} onChange={onAssetChange} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}; 