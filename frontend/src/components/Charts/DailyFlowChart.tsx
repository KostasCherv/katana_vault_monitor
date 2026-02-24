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
import { formatDate, formatAmount } from '../../utils/formatters';
import type { AssetAggregate } from '../../types';

interface DailyFlowChartProps {
  assets: AssetAggregate[];
}

const CustomTooltip = ({ active, payload, label, assetSymbol }: any) => {
  const theme = useTheme();
  if (!active || !payload || payload.length === 0) return null;
  const deposits = payload.find((p: any) => p.dataKey === 'deposits');
  const withdrawals = payload.find((p: any) => p.dataKey === 'withdrawals');
  return (
    <Box sx={{ p: 1, backgroundColor: 'white', border: '1px solid #e0e0e0' }}>
      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>{`Date: ${label}`}</Typography>
      {deposits && (
        <Typography variant="body2" sx={{ color: theme.palette.success.main }}>
          Deposits: {formatAmount(deposits.value, assetSymbol)}
        </Typography>
      )}
      {withdrawals && (
        <Typography variant="body2" sx={{ color: theme.palette.error.main }}>
          Withdrawals: {formatAmount(withdrawals.value, assetSymbol)}
        </Typography>
      )}
    </Box>
  );
};

export const DailyFlowChart: React.FC<DailyFlowChartProps> = ({ assets }) => {
  const theme = useTheme();
  const assetSymbol = assets[0]?.asset || 'yvvbETH';

  const chartData = React.useMemo(() => {
    const dateMap = new Map<string, { date: string; deposits: number; withdrawals: number }>();
    assets.forEach((asset) => {
      asset.daily_data.forEach((day) => {
        const dateKey = formatDate(day.date, 'chart');
        if (!dateMap.has(dateKey)) {
          dateMap.set(dateKey, {
            date: dateKey,
            deposits: 0,
            withdrawals: 0,
          });
        }
        const existing = dateMap.get(dateKey)!;
        existing.deposits += day.deposits;
        existing.withdrawals += day.withdrawals;
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
            Daily Inflow/Outflow
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
          Daily Inflow/Outflow
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              tickFormatter={(value) => formatAmount(value, assetSymbol)}
            />
            <Tooltip content={<CustomTooltip assetSymbol={assetSymbol} />} />
            <Legend />
            <Bar dataKey="deposits" name="Deposits" fill={theme.palette.success.main}>
              {chartData.map((_, index) => (
                <Cell key={`cell-deposit-${index}`} fill={theme.palette.success.main} />
              ))}
            </Bar>
            <Bar dataKey="withdrawals" name="Withdrawals" fill={theme.palette.error.main}>
              {chartData.map((_, index) => (
                <Cell key={`cell-withdrawal-${index}`} fill={theme.palette.error.main} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}; 