export interface Wallet {
  id: string;
  usdBalance: number;
}

export interface Asset {
  symbol: string;
  name: string;
  type: string;
  decimals: number;
  isDepositEnabled: boolean;
  isTradingEnabled: boolean;
  iconUrl?: string;
  depositAddress?: string; // Critical for the modal
}

// NEW: Transaction Definition
export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRADE_WIN' | 'TRADE_LOSS';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  amountUsd: number;
  symbol: string | null;
  tokenAmount: number | null;
  destinationAddress: string | null;
  txHash: string | null;
  createdAt: string;
}

export interface WithdrawRequest {
  symbol: string;
  amountUsd: number;
  destinationAddress: string;
}