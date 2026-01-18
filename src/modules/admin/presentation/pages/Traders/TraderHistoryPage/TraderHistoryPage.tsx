import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './TraderHistoryPage.module.css';
import { predictionRepository } from 'src/modules/prediction/infrastructure/repositories/prediction.repository';
import type { Prediction } from 'src/modules/prediction/domain/prediction.types';
import { AdminTradeModal } from '../../../components/AdminTradeModal/AdminTradeModal';
import { AdminResolveModal } from '../../../components/AdminResolveModal/AdminResolveModal'; // <--- Import
import Button from 'src/shared/presentation/components/Button/Button';
import { formatCurrency } from 'src/shared/utils/format.utils';
import { formatDateTime } from 'src/shared/utils/date.utils';

export const TraderHistoryPage = () => {
  const { id } = useParams<{ id: string }>();
  
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals State
  const [isTradeModalOpen, setTradeModalOpen] = useState(false);
  const [resolvingPrediction, setResolvingPrediction] = useState<Prediction | null>(null); // <--- New State

  const fetchHistory = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await predictionRepository.getPredictionsByUserId(id);
      setPredictions(data);
    } catch (error) {
      console.error("Failed to load history", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const getStatusBadge = (pred: Prediction) => {
    if (pred.status === 'PENDING') return <span className={styles.badgePending}>Pending</span>;
    if (pred.result === 'WIN') return <span className={styles.badgeWin}>Win</span>;
    return <span className={styles.badgeLoss}>Loss</span>;
  };

  if (!id) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Trading History</h2>
        <Button 
          variant="secondary" 
          onClick={() => setTradeModalOpen(true)}
          style={{ borderColor: '#FCD535', color: '#FCD535' }}
        >
          ⚡ Force AI Trade
        </Button>
      </div>

      <div className={styles.tableWrapper}>
        {loading ? (
          <div className={styles.loading}>Loading history...</div>
        ) : predictions.length === 0 ? (
          <div className={styles.empty}>No trading history found.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Asset</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Result</th>
                <th>Payout</th>
                <th>Time</th>
                <th style={{ textAlign: 'right' }}>Action</th> {/* New Column */}
              </tr>
            </thead>
            <tbody>
              {predictions.map((pred) => (
                <tr key={pred.id}>
                  <td><span className={styles.symbol}>{pred.symbol}</span></td>
                  <td>
                    <span className={pred.direction === 'HIGH' ? styles.textGreen : styles.textRed}>
                      {pred.direction} {pred.direction === 'HIGH' ? '▲' : '▼'}
                    </span>
                  </td>
                  <td>{formatCurrency(pred.investment)}</td>
                  <td>{getStatusBadge(pred)}</td>
                  <td>
                    {pred.status === 'RESOLVED' ? (
                      <span className={pred.result === 'WIN' ? styles.textGreen : styles.textRed}>
                        {pred.result === 'WIN' ? '+' : ''}{formatCurrency(pred.payout || 0)}
                      </span>
                    ) : (
                      <span className={styles.textMuted}>---</span>
                    )}
                  </td>
                  <td className={styles.date}>{formatDateTime(pred.createdAt)}</td>
                  
                  {/* Action Column */}
                  <td style={{ textAlign: 'right' }}>
                    {pred.status === 'PENDING' && (
                      <button 
                        className={styles.resolveActionBtn}
                        onClick={() => setResolvingPrediction(pred)}
                      >
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ADMIN TRADE MODAL */}
      <AdminTradeModal
        userId={id}
        isOpen={isTradeModalOpen}
        onClose={() => setTradeModalOpen(false)}
        onSuccess={() => {
          setTradeModalOpen(false);
          fetchHistory();
        }}
      />

      {/* ADMIN RESOLVE MODAL */}
      <AdminResolveModal 
        isOpen={!!resolvingPrediction}
        prediction={resolvingPrediction}
        onClose={() => setResolvingPrediction(null)}
        onSuccess={() => {
          setResolvingPrediction(null);
          fetchHistory();
        }}
      />
    </div>
  );
};