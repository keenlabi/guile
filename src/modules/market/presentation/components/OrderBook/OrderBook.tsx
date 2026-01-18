import { useEffect, useState } from "react";
import styles from "./OrderBook.module.css";
import { binanceService } from "src/modules/market/infrastructure/services/binance.service";

interface OrderBookItem {
  price: number;
  amount: number;
  total: number;
}

export const OrderBook = ({ symbol }: { symbol: string }) => {
  
  const [, setBids] = useState<OrderBookItem[]>([]);
  const [, setAsks] = useState<OrderBookItem[]>([]);

  function processOrderBookData (
    data: string[][], 
    type: 'bids' | 'asks'
  ) {
    let runningTotal = 0;
    
    // 1. Map to objects
    const list = data.map(([priceStr, amountStr]) => {
      const price = parseFloat(priceStr);
      const amount = parseFloat(amountStr);
      return { price, amount, total: 0 };
    });

    // 2. Calculate Total (Cumulative)
    // For Asks, we want the "Best" price (Lowest) to be first for calculation
    // For Bids, we want the "Best" price (Highest) to be first
    // Note: Binance usually returns them sorted by "Best" price first already.
    
    const processed = list.map((item) => {
      runningTotal += item.amount;
      return { ...item, total: runningTotal };
    });

    // 3. For ASKS (Red), the UI usually shows High prices at top, Low at bottom.
    // So we might need to reverse the array for display purposes 
    // AFTER calculating the totals.
    if (type === 'asks') {
      return processed.reverse();
    }

    return processed;
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await binanceService.getOrderBook(symbol);
        
        // 1. Process Bids (Green) - already sorted High to Low by Binance
        const processedBids = processOrderBookData(data.bids.slice(0, 15), 'bids');
        
        // 2. Process Asks (Red) - already sorted Low to High by Binance
        // We calculate totals first, THEN reverse for display (High price at top)
        const processedAsks = processOrderBookData(data.asks.slice(0, 15), 'asks');

        setBids(processedBids);
        setAsks(processedAsks);
      } catch (e) {
        console.error("Failed to load order book", e);
      }
    };

    fetchBook();
    const interval = setInterval(fetchBook, 1000); // Live updates every second
    return () => clearInterval(interval);
  }, [symbol]);

  return (
    <div className={styles.orderBook}>
      <div className={styles.title}>Order Book</div>
      <div className={styles.asks}>
        {/* Map through red sell orders */}
        <div className={styles.row}><span className={styles.price}>93,635.0</span> <span>0.106</span></div>
      </div>
      <div className={styles.currentPrice}>93,617.53</div>
      <div className={styles.bids}>
        {/* Map through green buy orders */}
        <div className={styles.row}><span className={styles.priceGreen}>93,609.7</span> <span>0.014</span></div>
      </div>
    </div>
  );
};