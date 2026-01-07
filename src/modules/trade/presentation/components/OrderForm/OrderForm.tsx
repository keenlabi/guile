import { useState } from 'react';
import styles from './OrderForm.module.css';
import type { MarketPair } from 'src/modules/market/domain/market.constants';
import { predictionRepository } from 'src/modules/prediction/infrastructure/repositories/prediction.repository'; // Import Prediction Repo
import { useToast } from 'src/shared/presentation/hooks/useToast';

interface Props {
  pair: MarketPair;
  currentPrice: number;
  onSuccess?: () => void;
}

// Duration Options in Seconds
const DURATION_OPTIONS = [
  { label: '1m', value: 60 },
  { label: '3m', value: 180 },
  { label: '5m', value: 300 },
];

export const OrderForm = ({ pair, onSuccess }: Props) => {
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [amount, setAmount] = useState<string>('');
  const [duration, setDuration] = useState<number>(60); // Default 1 min

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
      // Optional: Clear amount or keep it for rapid fire betting?
      // setAmount(''); 
      
      if (onSuccess) onSuccess(); 

    } catch (error) {
      showError(error, "Prediction Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* 1. Investment Amount */}
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

      {/* 2. Duration Selector */}
      <div className={styles.inputGroup}>
        <div className={styles.labelRow}><span>Duration</span></div>
        <div className={styles.durationGrid}>
          {DURATION_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              type="button"
              className={`${styles.durationBtn} ${duration === opt.value ? styles.activeDuration : ''}`}
              onClick={() => setDuration(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Action Buttons (The Triggers) */}
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
    </div>
  );
};