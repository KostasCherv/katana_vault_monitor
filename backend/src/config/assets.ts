import { VaultBridgeAsset } from '../types';

export const TRACKED_ASSETS: VaultBridgeAsset[] = [
  {
    name: 'vbETH yVault',
    symbol: 'yvvbETH',
    contractAddress: '0xE007CA01894c863d7898045ed5A3B4Abf0b18f37',
  },
  {
    name: 'vbUSDC yVault',
    symbol: 'yvvbUSDC',
    contractAddress: '0x80c34BD3A3569E126e7055831036aa7b212cB159',
  },
  {
    name: 'vbUSDT yVault',
    symbol: 'yvvbUSDT',
    contractAddress: '0x9A6bd7B6Fd5C4F87eb66356441502fc7dCdd185B',
  },
  {
    name: 'vbWBTC yVault',
    symbol: 'yvvbWBTC',
    contractAddress: '0xAa0362eCC584B985056E47812931270b99C91f9d',
  },
];

export const getAssetBySymbol = (symbol: string): VaultBridgeAsset | undefined => {
  return TRACKED_ASSETS.find((asset) => asset.symbol === symbol);
};

export const getAssetByAddress = (address: string): VaultBridgeAsset | undefined => {
  return TRACKED_ASSETS.find((asset) => asset.contractAddress.toLowerCase() === address.toLowerCase());
}; 