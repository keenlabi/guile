import styles from "./MarketTicker.module.css";

// Mock Data
const marketData = [
  { symbol: 'BTC', name: 'Bitcoin', price: '95,150.00', change: '+3.15%' },
  { symbol: 'ETH', name: 'Ethereum', price: '3,328.35', change: '+5.99%' },
  { symbol: 'SOL', name: 'Solana', price: '144.78', change: '+3.33%' },
  { symbol: 'XRP', name: 'Ripple', price: '2.15', change: '+1.54%' },
  { symbol: 'TRX', name: 'Tron', price: '0.30', change: '+1.40%' },
  { symbol: 'PEPE', name: 'Pepe', price: '0.0000086', change: '+13.11%' },
];

export default function MarketTicker() {
  return (
    <div className={styles.tickerSection}>
      <div className={styles.maxWidthWrapper}>
        <h3 className={styles.sectionTitle}>Hot Spot</h3>
        <div className={styles.tickerGrid}>
            {marketData.map((coin) => (
                <div key={coin.symbol} className={styles.tickerCard}>
                    <div className={styles.coinInfo}>
                        <div className={styles.coinIcon}>{coin.symbol[0]}</div>
                        <div>
                            <div className={styles.coinSymbol}>{coin.symbol} <span>/ USDT</span></div>
                            <div className={styles.coinName}>{coin.name}</div>
                        </div>
                    </div>
                    <div className={styles.priceInfo}>
                        <div className={styles.price}>${coin.price}</div>
                        <div className={`${styles.change} ${coin.change.startsWith('+') ? styles.positive : styles.negative}`}>
                            {coin.change}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};