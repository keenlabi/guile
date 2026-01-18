import { useState, useEffect } from 'react';
import styles from './AdminPredictionList.module.css';
import { predictionRepository, type ResolvePayload } from 'src/modules/prediction/infrastructure/repositories/prediction.repository';
import type { Prediction } from 'src/modules/prediction/domain/prediction.types';
import { useToast } from 'src/shared/presentation/hooks/useToast';
import { formatCurrency } from 'src/shared/utils/format.utils';
import { calculateDuration, formatTime } from 'src/shared/utils/date.utils';

export const AdminPredictionList = () => {
  const { showSuccess } = useToast();
  const [pending, setPending] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const data = await predictionRepository.getPending();
      setPending(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleResolveSuccess = (id: string) => {
    setPending(prev => prev.filter(p => p.id !== id));
    showSuccess("Prediction Resolved");
  };

  if (loading) return <div className={styles.loading}>Loading pending bets...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Pending Predictions ({pending.length})</h2>
        <button onClick={fetchPending} className={styles.refreshBtn}>↻ Refresh</button>
      </div>

      <div className={styles.grid}>
        {pending.map(pred => (
          <ResolutionCard 
            key={pred.id} 
            prediction={pred} 
            onResolve={handleResolveSuccess} 
          />
        ))}
        {pending.length === 0 && <div className={styles.empty}>No pending predictions.</div>}
      </div>
    </div>
  );
};

// --- SUB-COMPONENT ---
export const ResolutionCard = ({ prediction, onResolve }: { prediction: Prediction, onResolve: (id: string) => void }) => {
  const { showError } = useToast();
  const [outcome, setOutcome] = useState<'WIN' | 'LOSS' | null>(null);
  // const [openPrice, setOpenPrice] = useState<number>(prediction.openPrice);
  // const [closePrice, setClosePrice] = useState<number>(0);
  const [pnl, setPnl] = useState<number>(0); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const calculateResult = (manualPrice: number) => {
  //   let isWin = false;

  //   if (prediction.direction === 'HIGH') {
  //     isWin = manualPrice > openPrice;
  //   } else {
  //     // LOW
  //     isWin = manualPrice < openPrice;
  //   }

  //   // 1. Set Outcome
  //   const newOutcome = isWin ? 'WIN' : 'LOSS';
  //   setOutcome(newOutcome);

  //   // 2. Auto-Calculate PnL
  //   if (isWin) {
  //     setPnl(0);
  //   } else {
  //     setPnl(prediction.investment);
  //   }
  // };

  // A. If Admin manually types a price (Real Scenario)
  // const handlePriceChange = (val: number) => {
  //   setClosePrice(val);
  //   if (val && !isNaN(parseFloat(val.toString()))) {
  //     calculateResult(val);
  //   }
  // };

  // FIXED: Logic moved from useEffect to this handler
  const handleSelectOutcome = (selectedOutcome: 'WIN' | 'LOSS') => {
    setOutcome(selectedOutcome);

    // if (selectedOutcome === 'WIN') {
    //   // 1. Calculate Profit (e.g. 80% return)
    //   const profit = prediction.investment * 0.8;
    //   setPnl(formatCurrency(profit.toFixed(2)));
      
    //   // 2. Mock Winning Price
    //   const mockWinPrice = prediction.direction === 'HIGH' 
    //     ? prediction.openPrice * 1.001 
    //     : prediction.openPrice * 0.999;
    //   setClosePrice(mockWinPrice.toFixed(2)));

    // } else {
    //   // 1. Calculate Loss (Full amount lost)
    //   setPnl(`-${formatCurrency(prediction.investment.toFixed(2))}`);
      
    //   // 2. Mock Losing Price
    //   const mockLossPrice = prediction.direction === 'HIGH' 
    //     ? prediction.openPrice * 0.999 
    //     : prediction.openPrice * 1.001;
    //   setClosePrice(formatCurrency(mockLossPrice.toFixed(2)));
    // }
  };

  const handleSubmit = async () => {
    if (!outcome || !pnl) return;
    setIsSubmitting(true);
    
    try {
      const payload: ResolvePayload = {
        outcome,
        // openPrice,
        // closePrice,
        payout: pnl
      };
      
      await predictionRepository.resolvePrediction(prediction.id, payload);
      onResolve(prediction.id);
    } catch (e) {
      showError(e, "Failed to resolve");
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.symbol}>{prediction.symbol}</span>
        <span className={`${styles.direction} ${prediction.direction === 'HIGH' ? styles.green : styles.red}`}>
          {prediction.direction}
        </span>
        <span className={styles.amount}>${prediction.investment}</span>
      </div>

      <div className={styles.meta}>
        <div>User: <span className={styles.val}>{prediction.userId.slice(0,6)}...</span></div>
        <div>Open price: <span className={styles.val}>{formatCurrency(prediction.openPrice)}</span></div>
        <div>Time: <span className={styles.val}>{calculateDuration(prediction.createdAt, prediction.expiresAt)}</span></div>
      </div>

      <div className={styles.meta}>
        <div>Created At: <span className={styles.val}>{formatTime(prediction.createdAt)}</span></div>
        <div>Expires At: <span className={styles.val}>{formatTime(prediction.expiresAt)}</span></div>
      </div>

      <hr className={styles.divider} />

      <div className={styles.controls}>
        <div className={styles.outcomeRow}>
          <button 
            className={`${styles.outcomeBtn} ${outcome === 'WIN' ? styles.btnWin : ''}`}
            onClick={() => handleSelectOutcome('WIN')} // <--- Use new handler
          >
            WIN
          </button>
          <button 
            className={`${styles.outcomeBtn} ${outcome === 'LOSS' ? styles.btnLoss : ''}`}
            onClick={() => handleSelectOutcome('LOSS')} // <--- Use new handler
          >
            LOSS
          </button>
        </div>


          <div className={styles.inputs}>
            {/* <div className={styles.field}>
              <label>Open Price</label>
              <input
                type="number"
                value={openPrice}
                onChange={e => {
                    const value = parseInt(e.target.value);
                    handlePriceChange(value)
                    setOpenPrice(value)
                }}
              />
            </div> */}

            {/* <div className={styles.field}>
              <label>Close Price</label>
              <input 
                type="number" 
                value={closePrice} 
                onChange={e => handlePriceChange(parseInt(e.target.value))}
              />
            </div> */}
            
            <div className={styles.field}>
                <label>Net PnL ($)</label>
                <input 
                    type="text" 
                    value={pnl} 
                    className={styles.readOnlyInput}
                    onChange={(e)=> {
                        if(e.target.value) {
                            const value = parseInt(e.target.value);
                            // if(value)
                                setPnl(value)
                        }
                    }}
                />
            </div>

            <button 
              className={styles.submitBtn} 
              disabled={(!pnl || outcome === null) || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? 'Saving...' : 'Confirm Resolution'}
            </button>
          </div>
      </div>
    </div>
  );
};