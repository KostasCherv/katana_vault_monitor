import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import { Card, CardContent, Typography, useTheme, Box } from '@mui/material';
import { formatDate } from '../../utils/formatters';
import type { AssetAggregate } from '../../types';

interface EventCountBarChartProps {
  assets: AssetAggregate[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  const theme = useTheme();
  if (!active || !payload || payload.length === 0) return null;
  const deposit = payload.find((p: any) => p.dataKey === 'depositEvents');
  const withdrawal = payload.find((p: any) => p.dataKey === 'withdrawalEvents');
  return (
    <Box sx={{ p: 1, backgroundColor: 'white', border: '1px solid #e0e0e0' }}>
      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>{`Date: ${label}`}</Typography>
      {deposit && (
        <Typography variant="body2" sx={{ color: theme.palette.success.main }}>
          Deposit Events: {deposit.value}
        </Typography>
      )}
      {withdrawal && (
        <Typography variant="body2" sx={{ color: theme.palette.error.main }}>
          Withdrawal Events: {withdrawal.value}
        </Typography>
      )}
    </Box>
  );
};

export const EventCountBarChart: React.FC<EventCountBarChartProps> = ({ assets }) => {
  const theme = useTheme();

  const chartData = React.useMemo(() => {
    const dateMap = new Map<string, { date: string; depositEvents: number; withdrawalEvents: number }>();
    assets.forEach((asset) => {
      asset.daily_data.forEach((day) => {
        const dateKey = formatDate(day.date, 'chart');
        if (!dateMap.has(dateKey)) {
          dateMap.set(dateKey, {
            date: dateKey,
            depositEvents: 0,
            withdrawalEvents: 0,
          });
        }
        const existing = dateMap.get(dateKey)!;
        existing.depositEvents += day.deposit_events;
        existing.withdrawalEvents += day.withdrawal_events;
      });
    });
    return Array.from(dateMap.values()).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [assets]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Event Count Per Day
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No data available for the selected period.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Event Count Per Day
        </Typography>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="depositEvents" name="Deposit Events" fill={theme.palette.success.main}>
              {chartData.map((_, index) => (
                <Cell key={`cell-depositEvents-${index}`} fill={theme.palette.success.main} />
              ))}
            </Bar>
            <Bar dataKey="withdrawalEvents" name="Withdrawal Events" fill={theme.palette.error.main}>
              {chartData.map((_, index) => (
                <Cell key={`cell-withdrawalEvents-${index}`} fill={theme.palette.error.main} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}; 