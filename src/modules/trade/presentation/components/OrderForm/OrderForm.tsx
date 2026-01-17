import { useState, useEffect } from 'react';
import styles from './OrderForm.module.css';
import type { MarketPair } from 'src/modules/market/domain/market.constants';
import { predictionRepository } from 'src/modules/prediction/infrastructure/repositories/prediction.repository';
import { useToast } from 'src/shared/presentation/hooks/useToast';
import { useAiMode } from 'src/modules/auth/presentation/hooks/useAiMode'; 
import { DurationPicker } from '../DurationPicker/DurationPicker';

interface Props {
  pair: MarketPair;
  currentPrice: number;
  onSuccess?: () => void;
}

export const OrderForm = ({ pair, onSuccess }: Props) => {
  const { showSuccess, showError } = useToast();
  
  // AI Mode Hook
  const { isManaged, toggleAiMode, isLoading: isAiLoading } = useAiMode();

  const [isLoading, setIsLoading] = useState(false);

  // 1. Initialize Amount from LocalStorage
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('prediction_amount') || '10';
    }
    return '10';
  });

  // 2. Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('prediction_amount', amount);
  }, [amount]);

  const [duration, setDuration] = useState<number>(5); 

  // Handle Prediction Submission
  const handlePredict = async (direction: 'HIGH' | 'LOW') => {
    if (!amount || parseFloat(amount) <= 0) {
      showError("Please enter a valid amount");
      return;
    }

    setIsLoading(true);

    try {
      await predictionRepository.placePrediction({
        symbol: pair.baseAsset,
        direction: direction,
        amount: parseFloat(amount),
        duration: duration
      });

      showSuccess(`${direction} Prediction Placed!`);
      if (onSuccess) onSuccess(); 

    } catch (error) {
      showError(error, "Prediction Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      
      {/* 1. SHARED HEADER (Always Visible) */}
      <div className={styles.header}>
        <div className={styles.aiToggleWrapper}>
          <span className={isManaged ? styles.aiLabelActive : styles.aiLabel}>
            AI Agent
          </span>
          <label className={styles.switch}>
            <input 
              type="checkbox" 
              checked={isManaged}
              disabled={isAiLoading}
              onChange={(e) => toggleAiMode(e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>

      {/* 2. CONTENT AREA */}
      {isManaged ? (
        // --- AI ACTIVE OVERLAY ---
        <div className={styles.aiOverlay}>
          <div className={styles.pulseRing}>
            <div className={styles.aiIcon}>🤖</div>
          </div>
          <h3 className={styles.aiTitle}>AI Active</h3>
          <p className={styles.aiDesc}>
            System is analyzing {pair.baseAsset} markets.<br/>
            Manual trading is paused.
          </p>
          <div className={styles.scanningBar}>
            <div className={styles.scanningLine} />
          </div>
        </div>
      ) : (
        // --- MANUAL FORM BODY ---
        <div className={styles.formBody}>
          
          <div className={styles.inputGroup}>
            <div className={styles.labelRow}><span>Amount ($)</span></div>
            <div className={styles.inputWrapper}>
              <span className={styles.suffix}>$</span>
              <input 
                type="number" 
                placeholder="0.00"
                className={styles.input} 
                value={amount}
                onChange={e => setAmount(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button 
              disabled={isLoading}
              className={`${styles.predictBtn} ${styles.btnHigh}`}
              onClick={() => handlePredict('HIGH')}
            >
              {isLoading ? '...' : `HIGH ▲`}
            </button>
            
            <button 
              disabled={isLoading}
              className={`${styles.predictBtn} ${styles.btnLow}`}
              onClick={() => handlePredict('LOW')}
            >
              {isLoading ? '...' : `LOW ▼`}
            </button>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.labelRow}><span>auto close</span></div>
            <DurationPicker 
              valueSeconds={duration} 
              onChange={(newVal) => setDuration(newVal)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};