import { useState } from 'react';
import styles from './AdminResolveModal.module.css';
import { predictionRepository, type ResolvePayload } from 'src/modules/prediction/infrastructure/repositories/prediction.repository';
import type { Prediction } from 'src/modules/prediction/domain/prediction.types';
import { useToast } from 'src/shared/presentation/hooks/useToast';
import { formatCurrency } from 'src/shared/utils/format.utils';
import { calculateDuration, formatTime } from 'src/shared/utils/date.utils';

interface Props {
  isOpen: boolean;
  prediction: Prediction | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminResolveModal = ({ isOpen, prediction, onClose, onSuccess }: Props) => {
  const { showSuccess, showError } = useToast();
  const [outcome, setOutcome] = useState<'WIN' | 'LOSS' | null>(null);
  const [pnl, setPnl] = useState<string>(''); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !prediction) return null;

  const handleSelectOutcome = (selected: 'WIN' | 'LOSS') => {
    setOutcome(selected);
    // Optional: Auto-fill logic could go here if needed
  };

  const handleSubmit = async () => {
    if (!outcome || !pnl) return;
    setIsSubmitting(true);
    
    try {
      const payload: ResolvePayload = {
        outcome,
        payout: parseFloat(pnl)
      };
      
      await predictionRepository.resolvePrediction(prediction.id, payload);
      showSuccess("Prediction Resolved Successfully");
      onSuccess();
      onClose();
    } catch (e: any) {
      showError(e.message || "Failed to resolve");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className={styles.header}>
          <h3>Resolve Prediction</h3>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        {/* INFO SUMMARY */}
        <div className={styles.summary}>
          <div className={styles.row}>
            <span className={styles.label}>Asset</span>
            <span className={styles.value}>{prediction.symbol}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Direction</span>
            <span className={`${styles.value} ${prediction.direction === 'HIGH' ? styles.green : styles.red}`}>
              {prediction.direction}
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Investment</span>
            <span className={styles.value}>{formatCurrency(prediction.investment)}</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.row}>
            <span className={styles.label}>Opened</span>
            <span className={styles.sub}>{formatTime(prediction.createdAt)}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Duration</span>
            <span className={styles.sub}>{calculateDuration(prediction.createdAt, prediction.expiresAt)}</span>
          </div>
        </div>

        {/* CONTROLS */}
        <div className={styles.controls}>
          <label className={styles.sectionLabel}>Select Outcome</label>
          <div className={styles.outcomeRow}>
            <button 
              className={`${styles.outcomeBtn} ${outcome === 'WIN' ? styles.btnWin : ''}`}
              onClick={() => handleSelectOutcome('WIN')} 
            >
              WIN
            </button>
            <button 
              className={`${styles.outcomeBtn} ${outcome === 'LOSS' ? styles.btnLoss : ''}`}
              onClick={() => handleSelectOutcome('LOSS')} 
            >
              LOSS
            </button>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.sectionLabel}>Net PnL ($)</label>
            <input 
              type="number" 
              placeholder="0.00"
              value={pnl} 
              className={styles.input}
              onChange={(e) => setPnl(e.target.value)}
            />
            <p className={styles.hint}>Total amount to credit/debit the user.</p>
          </div>

          <button 
            className={styles.submitBtn} 
            disabled={(!pnl || outcome === null) || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Processing...' : 'Confirm Resolution'}
          </button>
        </div>

      </div>
    </div>
  );
};