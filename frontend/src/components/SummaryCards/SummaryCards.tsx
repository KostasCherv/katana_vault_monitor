import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Event,
  Timeline,
  Schedule,
} from '@mui/icons-material';
import { formatLargeNumber, formatDate, formatAmount } from '../../utils/formatters';
import type { AssetAggregate } from '../../types';

interface SummaryCardsProps {
  assets: AssetAggregate[];
}

function formatLargeAssetAmount(amount: number, symbol: string): string {
  // Format the number with K, M, B suffix, but keep the asset/unit
  const decimals = amount / Math.pow(10, 6) >= 1 ? 2 : 4; // 2 decimals for M/K, 4 for small
  const formatted = formatLargeNumber(
    parseFloat((amount / Math.pow(10, 0)).toFixed(decimals))
  );
  // Get the asset unit from formatAmount
  const unit = formatAmount(1, symbol).replace(/.*?([A-Z]+|\$).*/, '$1');
  return `${formatted} ${unit}`;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ assets }) => {
  const theme = useTheme();

  // Use the first asset symbol as a reference for formatting
  const assetSymbol = assets[0]?.asset || 'yvvbETH';

  const calculateSummaryStats = () => {
    let totalVolume = 0;
    let totalEvents = 0;
    let netFlow = 0;
    let latestEventTimestamp = '';

    assets.forEach((asset) => {
      const assetVolume = asset.total_deposits + asset.total_withdrawals;
      const assetNetFlow = asset.total_deposits - asset.total_withdrawals;
      const assetEvents = asset.total_deposit_events + asset.total_withdrawal_events;

      totalVolume += assetVolume;
      totalEvents += assetEvents;
      netFlow += assetNetFlow;

      // Find latest event timestamp
      asset.daily_data.forEach((day) => {
        const dayDate = new Date(day.date);
        if (!latestEventTimestamp || dayDate > new Date(latestEventTimestamp)) {
          latestEventTimestamp = day.date;
        }
      });
    });

    return {
      totalVolume,
      totalEvents,
      netFlow,
      latestEventTimestamp,
    };
  };

  const stats = calculateSummaryStats();

  const cards = [
    {
      title: 'Total Volume',
      value: formatLargeAssetAmount(stats.totalVolume, assetSymbol),
      icon: <Timeline color="primary" />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Total Events',
      value: formatLargeNumber(stats.totalEvents),
      icon: <Event color="secondary" />,
      color: theme.palette.secondary.main,
    },
    {
      title: 'Net Flow',
      value: formatLargeAssetAmount(stats.netFlow, assetSymbol),
      icon: stats.netFlow >= 0 ? <TrendingUp color="success" /> : <TrendingDown color="error" />,
      color: stats.netFlow >= 0 ? theme.palette.success.main : theme.palette.error.main,
    },
    {
      title: 'Latest Event',
      value: stats.latestEventTimestamp ? formatDate(stats.latestEventTimestamp, 'chart') : 'N/A',
      icon: <Schedule color="info" />,
      color: theme.palette.info?.main || theme.palette.primary.main,
    },
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: `repeat(${cards.length}, 1fr)` }, gap: 3, mb: 3 }}>
      {cards.map((card, index) => (
        <Box key={index}>
          <Card
            elevation={2}
            sx={{
              height: '100%',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {card.icon}
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ ml: 1, color: 'text.secondary' }}
                >
                  {card.title}
                </Typography>
              </Box>
              <Typography
                variant="h4"
                component="div"
                sx={{
                  fontWeight: 600,
                  color: card.color,
                  wordBreak: 'break-word',
                }}
              >
                {card.value}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );
}; 