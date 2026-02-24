import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Typography, Tooltip } from '@mui/material';
import { useEvents } from '../../hooks/useEvents';
import { formatDate, formatAmount, formatAddress, formatTransactionHash } from '../../utils/formatters';

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

  const columns: GridColDef[] = [
    {
      field: 'event_timestamp',
      headerName: 'Date',
      minWidth: 150,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={params.value ? formatDate(params.value, 'tooltip') : ''}>
          <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {formatDate(params.value || '', 'table')}
          </Box>
        </Tooltip>
      ),
    },
    {
      field: 'asset',
      headerName: 'Asset',
      minWidth: 90,
      flex: 0.6,
    },
    {
      field: 'event_type',
      headerName: 'Type',
      minWidth: 90,
      flex: 0.6,
    },
    {
      field: 'tx_hash',
      headerName: 'Tx Hash',
      minWidth: 140,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={params.value || ''}>
          <Box
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
            }}
          >
            {formatTransactionHash(params.value || '')}
          </Box>
        </Tooltip>
      ),
    },
    {
      field: 'block_number',
      headerName: 'Block',
      minWidth: 90,
      flex: 0.6,
      align: 'right',
      headerAlign: 'right',
    },
    {
      field: 'sender',
      headerName: 'Sender',
      minWidth: 120,
      flex: 0.9,
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={params.value || ''}>
          <Box
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
            }}
          >
            {formatAddress(params.value || '')}
          </Box>
        </Tooltip>
      ),
    },
    {
      field: 'receiver',
      headerName: 'Receiver',
      minWidth: 120,
      flex: 0.9,
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={params.value || ''}>
          <Box
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
            }}
          >
            {formatAddress(params.value || '')}
          </Box>
        </Tooltip>
      ),
    },
    {
      field: 'owner',
      headerName: 'Owner',
      minWidth: 120,
      flex: 0.9,
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={params.value || ''}>
          <Box
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
            }}
          >
            {formatAddress(params.value || '')}
          </Box>
        </Tooltip>
      ),
    },
    {
      field: 'assets',
      headerName: 'Assets',
      minWidth: 120,
      flex: 0.8,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params: GridRenderCellParams) => {
        const formatted = formatAmount(params.value, params.row?.asset || '');
        return (
          <Tooltip title={formatted}>
            <Box
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {formatted}
            </Box>
          </Tooltip>
        );
      },
    },
    {
      field: 'shares',
      headerName: 'Shares',
      minWidth: 120,
      flex: 0.8,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params: GridRenderCellParams) => {
        const value = params.value ? Number(params.value).toLocaleString() : '';
        return (
          <Tooltip title={value}>
            <Box
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {value}
            </Box>
          </Tooltip>
        );
      },
    },
  ];
  
  return (
    <Box
      sx={{
        width: '100%',
        background: '#fff',
        borderRadius: 2,
        p: 2,
        overflow: 'hidden',
      }}
    >
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
          border: 'none',
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #e0e0e0',
            py: 1,
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f5f5f5',
            borderBottom: '2px solid #e0e0e0',
          },
          '& .MuiDataGrid-columnHeader': {
            fontWeight: 600,
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 600,
          },
          '& .MuiDataGrid-virtualScroller': {
            minHeight: 200,
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid #e0e0e0',
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