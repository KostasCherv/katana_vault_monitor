import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import type { DateRange } from '../../types';

interface DateRangeSelectorProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

const PRESET_RANGES = [
  { label: '7D', days: 7 },
  { label: '14D', days: 14 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
];

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  dateRange,
  onDateRangeChange,
}) => {
  const theme = useTheme();

  const handlePresetClick = (days: number) => {
    const to = endOfDay(new Date());
    const from = startOfDay(subDays(to, days));
    onDateRangeChange({ from, to });
  };

  const handleFromDateChange = (date: Date | null) => {
    if (date) {
      onDateRangeChange({
        ...dateRange,
        from: startOfDay(date),
      });
    }
  };

  const handleToDateChange = (date: Date | null) => {
    if (date) {
      onDateRangeChange({
        ...dateRange,
        to: endOfDay(date),
      });
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 3,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Date Range
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { xs: 'stretch', sm: 'center' } }}>
        <ButtonGroup
          variant="outlined"
          size="small"
          sx={{ flexShrink: 0 }}
        >
          {PRESET_RANGES.map(({ label, days }) => (
            <Button
              key={label}
              onClick={() => handlePresetClick(days)}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              {label}
            </Button>
          ))}
        </ButtonGroup>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ display: 'flex', gap: 2, flexGrow: 1 }}>
            <DatePicker
              label="From"
              value={dateRange.from}
              onChange={handleFromDateChange}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                },
              }}
            />
            <DatePicker
              label="To"
              value={dateRange.to}
              onChange={handleToDateChange}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                },
              }}
            />
          </Box>
        </LocalizationProvider>
      </Box>
    </Paper>
  );
}; 