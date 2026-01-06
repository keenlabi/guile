import { useEffect, useState } from 'react';
import { binanceService } from 'src/modules/market/infrastructure/services/binance.service';
import styles from '../OrderBook/OrderBook.module.css'; // Reuse basic list styles

export const RecentTrades = ({ symbol }: { symbol: string }) => {
  const [trades, setTrades] = useState<any[]>([]);

  useEffect(() => {
    const fetchTrades = async () => {
      const data = await binanceService.getRecentTrades(symbol);
      setTrades(data);
    };
    fetchTrades();
    const interval = setInterval(fetchTrades, 1000);
    return () => clearInterval(interval);
  }, [symbol]);

  return (
    <div className={styles.container} style={{ borderTop: '1px solid #2a2e39' }}>
      <div className={styles.header}>
        <span>Price(USDT)</span>
        <span>Time</span>
      </div>
      <div className={styles.scrollArea}>
        {trades.map((t, i) => (
          <div key={i} className={styles.row}>
            <div className={styles.rowContent}>
              {/* If isBuyerMaker is true, it's a Sell (Red), else Buy (Green) */}
              <span className={t.isBuyerMaker ? styles.askPrice : styles.bidPrice}>
                {parseFloat(t.price).toFixed(2)}
              </span>
              <span className={styles.lightText}>
                {new Date(t.time).toLocaleTimeString([], { hour12: false })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};