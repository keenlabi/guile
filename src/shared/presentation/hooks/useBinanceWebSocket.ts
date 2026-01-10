import { useEffect, useRef } from 'react';

export const useBinanceWebSocket = (
  symbol: string, 
  onUpdate: (price: number, time: number) => void
) => {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const cleanSymbol = symbol.toLowerCase();
    // SWITCH: From 'kline_1h' to 'aggTrade' (Real-time ticks)
    const url = `wss://stream.binance.com:9443/ws/${cleanSymbol}@aggTrade`;
    
    if (wsRef.current) wsRef.current.close();

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      // aggTrade structure:
      // "p": Price
      // "T": Trade time (ms)
      const price = parseFloat(message.p);
      const time = message.T / 1000; // Seconds

      onUpdate(price, time);
    };

    return () => {
      ws.close();
    };
  }, [symbol, onUpdate]);
};