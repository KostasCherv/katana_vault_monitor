import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';
import { TRACKED_ASSETS } from '../../config/assets';
import { CurrencyBitcoin, CurrencyExchange, AttachMoney, Token } from '@mui/icons-material';

const assetIcon = (symbol: string) => {
  switch (symbol) {
    case 'yvvbETH':
      return <Token sx={{ color: '#627eea', fontSize: 18, mr: 0.5 }} />;
    case 'yvvbUSDC':
      return <AttachMoney sx={{ color: '#2775ca', fontSize: 18, mr: 0.5 }} />;
    case 'yvvbUSDT':
      return <CurrencyExchange sx={{ color: '#26a17b', fontSize: 18, mr: 0.5 }} />;
    case 'yvvbWBTC':
      return <CurrencyBitcoin sx={{ color: '#f7931a', fontSize: 18, mr: 0.5 }} />;
    default:
      return null;
  }
};

interface AssetSelectorProps {
  asset: string;
  onChange: (asset: string) => void;
}

export const AssetSelector: React.FC<AssetSelectorProps> = ({ asset, onChange }) => {
  return (
    <FormControl size="small" variant="outlined" sx={{ minWidth: 160, m: 0 }}>
      <InputLabel id="asset-selector-label" sx={{ top: '-6px' }}>Asset</InputLabel>
      <Select
        labelId="asset-selector-label"
        value={asset}
        label="Asset"
        onChange={(e) => onChange(e.target.value)}
        sx={{ borderRadius: 1, fontWeight: 500, background: 'transparent', height: 40, pl: 1 }}
        renderValue={(selected) => {
          const assetObj = TRACKED_ASSETS.find((a) => a.symbol === selected);
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {assetIcon(selected as string)}
              <Typography variant="body2" fontWeight={600}>{assetObj?.name || selected}</Typography>
            </Box>
          );
        }}
        MenuProps={{
          PaperProps: {
            sx: { mt: 1, borderRadius: 2, minWidth: 180 },
          },
        }}
      >
        {TRACKED_ASSETS.map((a) => (
          <MenuItem key={a.symbol} value={a.symbol}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {assetIcon(a.symbol)}
              <Typography variant="body2" fontWeight={600}>{a.name}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}; 