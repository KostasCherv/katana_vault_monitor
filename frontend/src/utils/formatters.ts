import { format, formatDistanceToNow } from 'date-fns';
import { getAssetDecimals, getAssetDisplayName } from '../config/assets';

export const formatAmount = (amount: string | number, symbol: string): string => {
  const decimals = getAssetDecimals(symbol);
  const displayName = getAssetDisplayName(symbol);
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Convert from wei/smallest unit to display unit
  const displayAmount = numericAmount / Math.pow(10, decimals);
  
  // Format based on asset type
  switch (symbol) {
    case 'yvvbETH':
      return `${displayAmount.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })} ${displayName}`;
    case 'yvvbUSDC':
    case 'yvvbUSDT':
      return `$${displayAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    case 'yvvbWBTC':
      return `${displayAmount.toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 })} ${displayName}`;
    default:
      return `${displayAmount.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })} ${displayName}`;
  }
};

export const formatLargeNumber = (num: number): string => {
  if (num >= 1e9) {
    return (num / 1e9).toLocaleString(undefined, { maximumFractionDigits: 2 }) + 'B';
  }
  if (num >= 1e6) {
    return (num / 1e6).toLocaleString(undefined, { maximumFractionDigits: 2 }) + 'M';
  }
  if (num >= 1e3) {
    return (num / 1e3).toLocaleString(undefined, { maximumFractionDigits: 2 }) + 'K';
  }
  return num.toLocaleString();
};

export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatDate = (dateString: string, formatType: 'chart' | 'table' | 'tooltip' = 'table'): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  switch (formatType) {
    case 'chart':
      return format(date, 'MMM dd');
    case 'table':
      return format(date, 'MMM dd, yyyy HH:mm');
    case 'tooltip':
      return format(date, 'MMM dd, yyyy HH:mm:ss');
    default:
      return format(date, 'MMM dd, yyyy');
  }
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};

export const formatTransactionHash = (hash: string): string => {
  if (!hash) return '';
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
};

export const getExplorerUrl = (txHash: string): string => {
  return `https://explorer.katana.network/tx/${txHash}`;
};

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
  }
}; 