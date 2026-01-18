import { Link, useNavigate } from 'react-router-dom';
import styles from './MarketHeader.module.css';
import type { MarketPair } from 'src/modules/market/domain/market.constants';
import { SymbolSelector } from '../SymbolSelector/SymbolSelector';
import { useAuth } from 'src/shared/presentation/hooks/useAuth';
import { formatCurrency } from 'src/shared/utils/format.utils';
import { ChartTypeDropdown, type ChartStyleType } from '../ChatTypeDropdown/ChartTypeDropdown';
import { useState } from 'react';
import FullScreenIcon from "src/shared/presentation/assets/icons/fullscreen.svg?react";
import { ROUTES } from 'src/shared/presentation/routes/routes';

interface Props {
  currentSymbol: string;
  pairs: MarketPair[];
  price: string;
  priceChange: string;
  isPositive: boolean;
  balance: number | null;
  onSymbolChange: (pair: MarketPair) => void;
  onTypeChange: (type: ChartStyleType) => void;
  onFullscreen: () => void;
  onTimeframeChange: (interval: string) => void;
  onDepositTriggered: ()=> void;
}

export const MarketHeader = ({ 
  currentSymbol, 
  pairs, 
  price, 
  priceChange, 
  isPositive, 
  balance,
  onSymbolChange,
  onTypeChange,
  onFullscreen

}: Props) => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [currentType, setCurrentType] = useState<ChartStyleType>('area');
  // const [activeTimeframe, setActiveTimeframe] = useState('1h');

  const handleTypeChange = (type: ChartStyleType) => {
    setCurrentType(type);
    onTypeChange(type);
  };

  // const handleTimeframeClick = (tf: string) => {
  //   setActiveTimeframe(tf);
  //   onTimeframeChange(tf);
  // };

  return (
    <header className={styles.header}>
      {/* 1. LEFT: Navigation */}
      <div className={styles.leftGroup}>
        <Link to={ROUTES.PROFILE} className={styles.avatar}>{profile?.email[0]}</Link>
        
        {/* Symbol Info (Moved from old text header to here) */}
        <div className={styles.symbolInfo}>
          <SymbolSelector 
            currentSymbol={currentSymbol}
            pairs={pairs}
            onSelect={onSymbolChange}
          />
        </div>

        {/* <TimeframeDropdown  currentTimeframe={activeTimeframe}  onChange={handleTimeframeClick}  /> */}

        {/* <div className={styles.seperator} /> */}

        <ChartTypeDropdown currentType={currentType} onChange={handleTypeChange} />

          <span className={`${styles.price} ${isPositive ? styles.green : styles.red}`}>
            {formatCurrency(price)}
          </span>

          <span className={styles.change}>
            {priceChange}
          </span>
      </div>

      {/* 2. RIGHT: Account / Wallet (Optional) */}
      <div className={styles.rightGroup}>
        <FullScreenIcon 
          className={styles.iconBtn} 
          onClick={onFullscreen}
        />
        
        <div className={styles.walletBadge}>
          <div className={styles.walletAmount}>
            {balance !== null ? formatCurrency(balance) : '---'}
          </div>
          <button className={styles.depositBtn} onClick={()=> navigate(ROUTES.WALLET)}>Deposit</button>
        </div>
      </div>
    </header>
  );
};