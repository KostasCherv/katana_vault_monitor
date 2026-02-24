import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { Card, CardContent, Typography } from '@mui/material';
import { formatDate, formatAmount } from '../../utils/formatters';
import type { AssetAggregate } from '../../types';

interface NetFlowBarChartProps {
  assets: AssetAggregate[];
}

export const NetFlowBarChart: React.FC<NetFlowBarChartProps> = ({ assets }) => {
  const assetSymbol = assets[0]?.asset || 'yvvbETH';

  const chartData = React.useMemo(() => {
    const dateMap = new Map<string, { date: string; netFlow: number }>();
    assets.forEach((asset) => {
      asset.daily_data.forEach((day) => {
        const dateKey = formatDate(day.date, 'chart');
        if (!dateMap.has(dateKey)) {
          dateMap.set(dateKey, {
            date: dateKey,
            netFlow: 0,
          });
        }
        const existing = dateMap.get(dateKey)!;
        existing.netFlow += day.deposits - day.withdrawals;
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
            Net Flow Per Day
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
          Net Flow Per Day
        </Typography>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(value) => formatAmount(value, assetSymbol)} />
            <Tooltip
              formatter={(value: number) => [formatAmount(value, assetSymbol), 'Net Flow']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Bar dataKey="netFlow" name="Net Flow">
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-netflow-${index}`}
                  fill={entry.netFlow >= 0 ? '#2e7d32' : '#d32f2f'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}; 