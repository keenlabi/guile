export interface WalletAsset {
  symbol: string;
  name: string;
  decimals: number;
  balance: number;
  balanceUsd: number;
  rate: number;
  depositAddress: string;
  iconUrl?: string;
  isDepositEnabled: boolean;
  isTradingEnabled: boolean;
  isWithdrawalEnabled: boolean;
}

export interface Wallet {
  id: string;
  usdBalance: number; // The total balance from backend
  assets: WalletAsset[];
}