import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Typography, Chip, Link } from '@mui/material';
import { useEvents } from '../../hooks/useEvents';
import { formatDate, formatAmount, formatAddress, getExplorerUrl } from '../../utils/formatters';
// import type { VaultBridgeEvent } from '../../types';

interface EventsDataGridProps {
  asset?: string;
  eventType?: string;
  from?: string;
  to?: string;
}

export const EventsDataGrid: React.FC<EventsDataGridProps> = (props) => {
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);

  const { data, isLoading, error } = useEvents({
    ...props,
    page: page + 1,
    limit: pageSize,
  });


  const totalRows = data?.pagination?.total || 0;
  const events = data?.data || [];

  const columns = [
    { field: 'event_timestamp', headerName: 'Date', width: 170, valueFormatter: (value: string) => formatDate(value || '', 'table') },
    { field: 'asset', headerName: 'Asset', width: 110 },
    { field: 'event_type', headerName: 'Type', width: 110 },
    { field: 'tx_hash', headerName: 'Tx Hash', width: 220 },
    { field: 'block_number', headerName: 'Block', width: 120 },
    { field: 'sender', headerName: 'Sender', width: 180, valueFormatter: (value: string) => formatAddress(value || '') },
    { field: 'receiver', headerName: 'Receiver', width: 180, valueFormatter: (value: string) => formatAddress(value || '') },
    { field: 'owner', headerName: 'Owner', width: 180, valueFormatter: (value:string) => formatAddress(value || '') },
    {
      field: 'assets', headerName: 'Assets', width: 160, valueFormatter: (value: string) => {
      return formatAmount(value, '')
    } },
    { field: 'shares', headerName: 'Shares', width: 160 },
  ];
  
  return (
    <Box sx={{ height: 600, width: '100%', background: '#fff', borderRadius: 2, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Events
      </Typography>
      <DataGrid
        rows={events}
        columns={columns}
        getRowId={(row) => row.id}
        loading={isLoading}
        pagination
        paginationMode="server"
        rowCount={totalRows}
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={(model) => {
          setPage(model.page);
          setPageSize(model.pageSize);
        }}
        pageSizeOptions={[10, 20, 25, 50, 100]}
        disableRowSelectionOnClick
        autoHeight
        onRowClick={(params) => {
          const txHash = params.row.tx_hash;
          if (txHash) {
            window.open(`https://explorer.katanarpc.com/tx/${txHash}`, '_blank');
          }
        }}
        sx={{
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
          },
        }}
      />
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          Failed to load events: {error.message}
        </Typography>
      )}
      {!isLoading && !error && events.length === 0 && (
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          No events found for the selected filters.
        </Typography>
      )}
    </Box>
  );
}; 