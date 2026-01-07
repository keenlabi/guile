export interface Order {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  status: 'FILLED' | 'OPEN' | 'CANCELLED';
  amount: number;      // Crypto Amount
  total: number;       // USD Value
  price: number;
  createdAt: string;
}

export interface PlaceOrderDTO {
  symbol: string;
  side: 'BUY' | 'SELL';
  amountUsd: number;
}