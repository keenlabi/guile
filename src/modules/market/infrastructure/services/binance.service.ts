import axios from 'axios';

// Public Binance Endpoints (No API Key needed for these)
const BASE_URL = 'https://api.binance.com/api/v3';

export const binanceService = {
  // Get Candlestick Data for Chart
  getCandles: async (symbol: string = 'BTCUSDT', interval: string = '1h') => {
    // Limit 1000 candles
    const url = `${BASE_URL}/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=1000`;
    const { data } = await axios.get(url);
    
    // Format for Lightweight Charts
    return data.map((d: any) => ({
      time: d[0] / 1000, // Unix Timestamp in seconds
      open: parseFloat(d[1]),
      high: parseFloat(d[2]),
      low: parseFloat(d[3]),
      close: parseFloat(d[4]),
    }));
  },

  // Get Order Book (Depth)
  getOrderBook: async (symbol: string = 'BTCUSDT') => {
    const url = `${BASE_URL}/depth?symbol=${symbol.toUpperCase()}&limit=10`;
    const { data } = await axios.get(url);
    return {
      bids: data.bids, // [price, amount]
      asks: data.asks,
    };
  },

  // Get Recent Trades
  getRecentTrades: async (symbol: string = 'BTCUSDT') => {
    const url = `${BASE_URL}/trades?symbol=${symbol.toUpperCase()}&limit=20`;
    const { data } = await axios.get(url);
    return data;
  },

  // Get 24hr Ticker Stats
  get24hrStats: async (symbol: string = 'BTCUSDT') => {
    const url = `${BASE_URL}/ticker/24hr?symbol=${symbol.toUpperCase()}`;
    const { data } = await axios.get(url);
    return data;
  },

  getLatestCandle: async (symbol: string = 'BTCUSDT', interval: string = '1h') => {
    const url = `${BASE_URL}/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=1`;
    const { data } = await axios.get(url);
    const d = data[0];
    
    return {
      time: d[0] / 1000,
      open: parseFloat(d[1]),
      high: parseFloat(d[2]),
      low: parseFloat(d[3]),
      close: parseFloat(d[4]),
    };
  }
};