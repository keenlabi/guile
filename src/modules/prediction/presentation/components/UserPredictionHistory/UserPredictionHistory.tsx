import { useState, useEffect, useMemo } from 'react';
import styles from './UserPredictionHistory.module.css';
import { predictionRepository } from 'src/modules/prediction/infrastructure/repositories/prediction.repository';
import type { Prediction } from 'src/modules/prediction/domain/prediction.types';
import { formatCurrency } from 'src/shared/utils/format.utils';
import { formatTime } from 'src/shared/utils/date.utils';
import { useToast } from 'src/shared/presentation/hooks/useToast';

export const UserPredictionHistory = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);

  // Poll for data to keep "Active" statuses fresh
  const fetchData = async () => {
    try {
      const data = await predictionRepository.getMyPredictions();
      
      // SORTING STRATEGY:
      // 1. Pending/Active trades go to the TOP.
      // 2. Within those groups, sort by newest (createdAt).
      const sorted = data.sort((a, b) => {
        if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
        if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
        // If status is same, sort by date descending
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setPredictions(sorted);
    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); 
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchData(); 
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.headerTitle}>Recent Activity</div>

        <div className={styles.list}>
          {loading && predictions.length === 0 && <div className={styles.empty}>Loading...</div>}
          
          {!loading && predictions.length === 0 && (
            <div className={styles.empty}>No recent trades.</div>
          )}

          {predictions.map((item) => (
              <HistoryCard 
                key={item.id} 
                prediction={item} 
                onClick={() => item.status === 'RESOLVED' && setSelectedPrediction(item)}
                onCancelSuccess={handleRefresh} // <--- NEW PROP
              />
          ))}
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedPrediction && (
        <PredictionDetailModal 
          prediction={selectedPrediction} 
          onClose={() => setSelectedPrediction(null)} 
        />
      )}
    </>
  );
};

// --- HISTORY CARD ---
const HistoryCard = ({ prediction, onClick, onCancelSuccess}: { prediction: Prediction; onClick: () => void; onCancelSuccess: () => void;}) => {
  
  const { showSuccess, showError } = useToast();
  const [now, setNow] = useState(Date.now());
  const [isCancelling, setIsCancelling] = useState(false);

  const isHigh = prediction.direction === 'HIGH';
  const isPending = prediction.status === 'PENDING';

  useEffect(() => {
    if (!isPending) return;
    const interval = setInterval(() => setNow(Date.now()), 100); // 10Hz updates
    return () => clearInterval(interval);
  }, [isPending]);

  // 2. Calculate Progress & Refund
  const stats = useMemo(() => {
    if (!isPending) return { width: 0, refund: 0, isExpired: true };

    const start = new Date(prediction.createdAt).getTime();
    const end = new Date(prediction.expiresAt).getTime();
    const totalDuration = end - start;
    const elapsed = now - start;
    const timeLeft = end - now;

    // Percent of time passed (0 to 100)
    let pct = (elapsed / totalDuration) * 100;
    pct = Math.min(Math.max(pct, 0), 100); // Clamp

    // Refund Value: Linear Decay
    // Starts at 100% of investment, drops to 0% at expiry
    const refundRatio = Math.max(0, timeLeft / totalDuration); 
    const refund = prediction.investment * refundRatio;

    return { 
      width: pct, 
      refund, 
      isExpired: now >= end 
    };
  }, [now, prediction, isPending]);
  
  const handleCancel = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Don't trigger the card click (Modal)
    if (stats.isExpired || stats.refund < 1) return; // Can't cancel if expired or value too low

    setIsCancelling(true);
    try {
      await predictionRepository.cancelPrediction(prediction.id);
      showSuccess(`Cancelled! Refunded ${formatCurrency(stats.refund)}`);
      onCancelSuccess();
    } catch (err) {
      showError(err, "Cancel failed");
    } finally {
      setIsCancelling(false);
    }
  };

  // Visuals
  const dirColor = isHigh ? styles.greenText : styles.redText;
  const arrowIcon = isHigh ? '▲' : '▼';
  
  let mainValue = '';
  let mainColor = styles.text;

  if (!isPending) {
    // RESOLVED (Static)
    const isWin = prediction.result === 'WIN';
    mainValue = isWin 
      ? `+$${(prediction.payout ?? 0).toFixed(2)}`
      : `-$${prediction.investment.toFixed(2)}`;
    mainColor = isWin ? styles.greenText : styles.redText;
  } else {
    // PENDING (Active)
    if (stats.isExpired) {
       mainValue = "Resolving..."; 
       mainColor = styles.pendingText;
    } else {
       mainValue = `$${(prediction.payout ?? 0).toFixed(2)}`;
       mainColor = styles.greenText; 
    }
  }

  return (
    <div 
      className={`${styles.card} ${!isPending ? styles.clickable : ''}`} 
      onClick={onClick}
    >
      {/* BACKGROUND PROGRESS BAR */}
      {isPending && !stats.isExpired && (
        <div 
          className={styles.progressBar} 
          style={{ width: `${stats.width}%` }} 
        />
      )}

      <div className={styles.leftCol}>
        <span className={`${styles.directionIcon} ${dirColor}`}>{arrowIcon}</span>
        <div className={styles.infoGroup}>
          <span className={styles.symbol}>{prediction.symbol}</span>
          <span className={styles.time}>{formatTime(prediction.expiresAt)}</span>
        </div>
      </div>

      <div className={styles.rightCol}>
        <span className={`${styles.payout} ${mainColor}`}>{mainValue}</span>
        
        {/* If Active & Not Expired: Show Cancel Button */}
        {isPending && !stats.isExpired ? (
          <button 
            className={styles.cancelBtn} 
            onClick={handleCancel}
            disabled={isCancelling}
          >
            {isCancelling ? '...' : `Cancel ${formatCurrency(stats.refund, false)}`}
          </button>
        ) : (
          /* If History or Expired: Show Investment amount */
          <span className={styles.investment}>{formatCurrency(prediction.investment)}</span>
        )}
      </div>
    </div>
  );
};

// --- DETAIL MODAL COMPONENT ---
const PredictionDetailModal = ({ prediction, onClose }: { prediction: Prediction, onClose: () => void }) => {
  const isWin = prediction.result === 'WIN';
  const pnlColor = isWin ? styles.greenText : styles.redText;
  const pnlSign = isWin ? '+' : '-';
  const finalAmount = isWin ? prediction.payout : prediction.investment;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Trade Details</h3>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        <div className={styles.modalBody}>
          {/* Result Badge */}
          <div className={styles.resultRow}>
             <span className={`${styles.bigBadge} ${isWin ? styles.bgGreen : styles.bgRed}`}>
                {prediction.result}
             </span>
             <span className={`${styles.bigPnl} ${pnlColor}`}>
                {pnlSign}{formatCurrency(finalAmount ?? 0)}
             </span>
          </div>

          <div className={styles.divider} />

          {/* Details Grid */}
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <label>Asset</label>
              <span>{prediction.symbol} / USD</span>
            </div>
            <div className={styles.detailItem}>
              <label>Direction</label>
              <span style={{ color: prediction.direction === 'HIGH' ? '#0ecb81' : '#f6465d' }}>
                {prediction.direction}
              </span>
            </div>
            <div className={styles.detailItem}>
              <label>Amount</label>
              <span>{formatCurrency(prediction.investment)}</span>
            </div>
            <div className={styles.detailItem}>
              <label>Duration</label>
              <span>{formatTime(prediction.createdAt)} - {formatTime(prediction.expiresAt)}</span>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Prices */}
          <div className={styles.priceComparison}>
             <div className={styles.priceBox}>
                <label>Open Price</label>
                <div className={styles.priceVal}>{prediction.openPrice}</div>
             </div>
             <div className={styles.arrow}>→</div>
             {/* <div className={styles.priceBox}>
                <label>Close Price</label>
                <div className={`${styles.priceVal} ${pnlColor}`}>
                  {prediction.closePrice ?? '---'}
                </div>
             </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};