import { useState, useRef } from 'react';
import styles from './SymbolSelector.module.css';
import type { MarketPair } from 'src/modules/market/domain/market.constants';

interface Props {
  currentSymbol: string;
  pairs: MarketPair[];
  onSelect: (pair: MarketPair) => void;
}

export const SymbolSelector = ({ currentSymbol, pairs, onSelect }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use the passed 'pairs' list instead of the constant
  const activePair = pairs.find(p => p.symbol === currentSymbol) || pairs[0] || { 
     baseAsset: '---', quoteAsset: '---', name: 'Loading' 
  };

  // ... (Click outside logic remains the same) ...

  const filteredPairs = pairs.filter(p => 
    p.baseAsset.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container} ref={dropdownRef}>
      {/* Trigger */}
      <div className={styles.trigger} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.selectedCoinIcon}>
          {activePair.icon ? (
            <img src={activePair.icon} alt={activePair.baseAsset} className={styles.iconImg} />
          ) : (
            activePair.baseAsset[0] // Fallback to first letter
          )}
        </div>
        <div className={styles.triggerInfo}>
          <span className={styles.symbol}>{activePair.baseAsset}/{activePair.quoteAsset}</span>
          <span className={styles.name}>{activePair.name}</span>
        </div>
        <span className={styles.arrow}>▼</span>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.searchWrapper}>
            <input 
              autoFocus
              type="text" 
              placeholder="Search coin..." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className={styles.list}>
            {filteredPairs.map((pair) => (
              <div 
                key={pair.symbol} 
                className={`${styles.item} ${pair.symbol === currentSymbol ? styles.activeItem : ''}`}
                onClick={() => { onSelect(pair); setIsOpen(false); setSearchTerm(''); }}
              >
                {/* ICON LOGIC */}
                <div className={styles.coinIcon}>
                  {pair.icon ? (
                    <img src={pair.icon} alt={pair.baseAsset} className={styles.iconImg} />
                  ) : (
                    pair.baseAsset[0] // Fallback to first letter
                  )}
                </div>

                <div className={styles.itemInfo}>
                  <div className={styles.itemSymbol}>{pair.baseAsset}</div>
                  <div className={styles.itemName}>{pair.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};