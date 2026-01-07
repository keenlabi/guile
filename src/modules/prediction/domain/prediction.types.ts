export interface Prediction {
  id: string;
  userId: string;
  symbol: string;           // e.g. "BTC"
  direction: 'HIGH' | 'LOW';
  investment: number;       // Changed from 'amount' to match backend
  expiresAt: string;        // Replaces 'duration'. ISO Date string.
  openPrice: number;        // Changed from 'entryPrice' to match backend
  closePrice?: number;
  result?: 'WIN' | 'LOSS';  // Changed from 'outcome'
  payout?: number;          // Added to show winnings
  status: 'PENDING' | 'RESOLVED'; // Changed 'OPEN' to 'PENDING'
  createdAt: string;
}

// Payload for creating a new prediction
export interface CreatePredictionDTO {
  symbol: string;
  direction: 'HIGH' | 'LOW';
  amount: number;
  duration: number;
}

// Payload for resolving (Admin/System use)
export interface ResolvePredictionDTO {
  outcome: 'WIN' | 'LOSS';
  closePrice: number;
}