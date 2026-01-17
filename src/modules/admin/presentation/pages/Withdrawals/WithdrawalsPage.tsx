import { useEffect, useState } from 'react';
import { adminRepository } from 'src/modules/admin/infrastructure/repositories/admin.repository';
import { AppHeader } from 'src/shared/presentation/components/AppHeader/AppHeader';
import type { Transaction } from 'src/modules/wallet/domain/wallet.types';
import styles from './WithdrawalsPage.module.css';
import { formatCurrency } from 'src/shared/utils/format.utils';
import { formatDateTime } from 'src/shared/utils/date.utils';
import { useToast } from 'src/shared/presentation/hooks/useToast';
import Button from 'src/shared/presentation/components/Button/Button';

export const WithdrawalsPage = () => {
  const [requests, setRequests] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await adminRepository.getPendingWithdrawals();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleProcess = async (id: string, action: 'APPROVE' | 'REJECT') => {
    // For approval, in a real app, you might want to prompt for a TX Hash.
    // For this demo, we'll send a dummy hash or handle it via a modal if needed.
    const txHash = action === 'APPROVE' ? prompt("Enter Blockchain TX Hash (Proof of Payment):") : undefined;
    
    if (action === 'APPROVE' && !txHash) return; // Cancelled

    setProcessingId(id);
    try {
      await adminRepository.processWithdrawal(id, action, txHash || undefined);
      showSuccess(`Withdrawal ${action === 'APPROVE' ? 'Approved' : 'Rejected'}`);
      
      // Remove from list immediately
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      showError(err, "Failed to process");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className={styles.container}>
      <AppHeader title="Withdrawal Requests" showCreateButton={false} />
      
      <div className={styles.tableWrapper}>
        {loading ? (
          <div className={styles.loading}>Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className={styles.empty}>No pending withdrawals.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Amount</th>
                <th>Destination</th>
                <th>Requested</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id}>
                  {/* <td className={styles.userId} title={req.userId}>
                    {req.userId.slice(0, 8)}
                  </td> */}
                  <td>
                    <div className={styles.amount}>
                      {formatCurrency(req.amountUsd)}
                    </div>
                    <div className={styles.subtext}>
                      ≈ {req.tokenAmount} {req.symbol}
                    </div>
                  </td>
                  <td>
                    <div className={styles.address}>
                      {req.destinationAddress}
                    </div>
                    {/* <div className={styles.networkBadge}>{req.network || req.symbol}</div> */}
                  </td>
                  <td className={styles.date}>
                    {formatDateTime(req.createdAt)}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button 
                        className={styles.rejectBtn}
                        disabled={!!processingId}
                        onClick={() => handleProcess(req.id, 'REJECT')}
                      >
                        Reject
                      </button>
                      <Button 
                        variant="primary" 
                        className={styles.approveBtn}
                        isLoading={processingId === req.id}
                        disabled={!!processingId}
                        onClick={() => handleProcess(req.id, 'APPROVE')}
                      >
                        Approve
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};