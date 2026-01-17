import { useState } from 'react';
import styles from './AdminTradeModal.module.css';
import { predictionRepository } from 'src/modules/prediction/infrastructure/repositories/prediction.repository';
import { useToast } from 'src/shared/presentation/hooks/useToast';
import { DurationPicker } from 'src/modules/trade/presentation/components/DurationPicker/DurationPicker';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userEmail: string;
}

export const AdminTradeModal = ({ isOpen, onClose, userId, userEmail }: Props) => {
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [symbol, setSymbol] = useState('BTC');
  const [amount, setAmount] = useState('50');
  const [direction, setDirection] = useState<'HIGH'|'LOW'>('HIGH');
  const [duration, setDuration] = useState(60);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await predictionRepository.adminPlacePrediction({
        userId,
        symbol,
        amount: parseFloat(amount),
        direction,
        duration
      });

      showSuccess(`Trade placed for ${userEmail}`);
      onClose();
    } catch (error) {
      showError(error, "Failed to place admin trade");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3>AI Force Trade</h3>
        <p className={styles.subtitle}>Trading on behalf of: <span>{userEmail}</span></p>

        <div className={styles.form}>
          <div className={styles.field}>
            <label>Asset</label>
            <select value={symbol} onChange={e => setSymbol(e.target.value)} className={styles.input}>
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
              <option value="SOL">Solana (SOL)</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Amount ($)</label>
            <input 
              type="number" 
              value={amount} 
              onChange={e => setAmount(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label>Direction</label>
            <div className={styles.toggleRow}>
              <button 
                className={`${styles.dirBtn} ${direction === 'HIGH' ? styles.green : ''}`}
                onClick={() => setDirection('HIGH')}
              >
                HIGH ▲
              </button>
              <button 
                className={`${styles.dirBtn} ${direction === 'LOW' ? styles.red : ''}`}
                onClick={() => setDirection('LOW')}
              >
                LOW ▼
              </button>
            </div>
          </div>

          <div className={styles.field}>
             <label>Duration</label>
             <DurationPicker valueSeconds={duration} onChange={setDuration} />
          </div>

          <button 
            className={styles.submitBtn} 
            disabled={isLoading} 
            onClick={handleSubmit}
          >
            {isLoading ? 'Processing...' : 'Execute Trade'}
          </button>
        </div>
      </div>
    </div>
  );
};