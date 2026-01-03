export interface AssetConfig {
  symbol: string;
  name: string;
  decimals: number;
  type: 'crypto' | 'fiat' | 'stablecoin';
  isDepositEnabled: boolean;
  isTradingEnabled: boolean;
  iconUrl?: string;
}

export interface Wallet {
  id: string;
  balance: number; // The USD balance
  assets: Record<string, number>; // e.g. { "BTC": 0.5 }
}