import { useNavigate } from 'react-router-dom';
import styles from './MarketHeader.module.css';

interface Props {
  symbol: string;
  price: string;
  priceChange: string;
  isPositive: boolean;
}

export const MarketHeader = ({ symbol, price, priceChange, isPositive }: Props) => {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      {/* 1. LEFT: Navigation */}
      <div className={styles.leftGroup}>
        <button className={styles.backBtn} onClick={() => navigate('/dashboard')} title="Back to Dashboard">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className={styles.separator} />
        
        <div className={styles.logo} onClick={() => navigate('/')}>
          <div className={styles.logoIcon} /> 
          <span className={styles.logoText}>CryptoApp</span>
        </div>
        
        <div className={styles.separator} />
        
        {/* Symbol Info (Moved from old text header to here) */}
        <div className={styles.tickerInfo}>
          <h1 className={styles.symbol}>{symbol}</h1>
          <span className={`${styles.price} ${isPositive ? styles.green : styles.red}`}>
            {price}
          </span>
          <span className={styles.change}>
            {priceChange}
          </span>
        </div>
      </div>

      {/* 2. RIGHT: Account / Wallet (Optional) */}
      <div className={styles.rightGroup}>
        <button className={styles.depositBtn}>Deposit</button>
        <div className={styles.avatar}>U</div>
      </div>
    </header>
  );
};