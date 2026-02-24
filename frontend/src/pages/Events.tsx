import React from 'react';
import { Box, Typography } from '@mui/material';
import { EventsDataGrid } from '../components/EventsDataGrid/EventsDataGrid';

export const Events: React.FC = () => {
  return (
    <Box sx={{ background: '#fff', borderRadius: 2, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        VaultBridge Events
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Detailed view of all deposit and withdrawal events with filtering and search capabilities.
      </Typography>
      <EventsDataGrid />
    </Box>
  );
}; 