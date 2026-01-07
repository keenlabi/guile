import { useNavigate } from 'react-router-dom';
import styles from './MarketHeader.module.css';
import { ROUTES } from 'src/shared/presentation/routes/routes';
import type { MarketPair } from 'src/modules/market/domain/market.constants';
import { SymbolSelector } from '../SymbolSelector/SymbolSelector';
import { useAuth } from 'src/shared/presentation/hooks/useAuth';
import { formatCurrency } from 'src/shared/utils/format.utils';

interface Props {
  currentSymbol: string;
  pairs: MarketPair[];
  price: string;
  priceChange: string;
  isPositive: boolean;
  balance: number | null;
  onSymbolChange: (pair: MarketPair) => void;
}

export const MarketHeader = ({ 
  currentSymbol, 
  pairs, 
  price, 
  priceChange, 
  isPositive, 
  balance,
  onSymbolChange 
}: Props) => {
  const { profile } = useAuth();
  const navigate = useNavigate();
console.log(balance)
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
          <span className={styles.logoText}>GUILE</span>
        </div>
        
        <div className={styles.separator} />
        
        {/* Symbol Info (Moved from old text header to here) */}
        <div className={styles.tickerInfo}>
          <SymbolSelector 
            currentSymbol={currentSymbol}
            pairs={pairs}
            onSelect={onSymbolChange} 
          />

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
        <div className={styles.walletBadge}>
          <span className={styles.walletLabel}>Real Account</span>
          <div className={styles.walletAmount}>
            {balance !== null ? formatCurrency(balance) : '---'}
          </div>
          <button className={styles.depositBtn}>+</button>
        </div>
        <button className={styles.depositBtn} onClick={()=> navigate(ROUTES.PORTFOLIO)}>Deposit</button>
        <div className={styles.avatar}>{profile?.email[0]}</div>
      </div>
    </header>
  );
};