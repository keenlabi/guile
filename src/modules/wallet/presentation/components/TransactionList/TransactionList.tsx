import styles from './TransactionList.module.css';
import type { Transaction } from '../../../domain/wallet.types';

interface Props {
  transactions: Transaction[];
  isLoading: boolean;
  onSelect: (tx: Transaction)=> void;
}

export const TransactionList = ({ transactions, isLoading, onSelect }: Props) => {
  
  if (isLoading) {
    return <div className={styles.loading}>Loading history...</div>;
  }

  if (transactions.length === 0) {
    return <div className={styles.empty}>No transaction history found.</div>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'COMPLETED': return styles.statusSuccess;
      case 'PENDING': return styles.statusPending;
      case 'FAILED': return styles.statusFailed;
      default: return '';
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Recent Activity</h3>
      
      <div className={styles.list}>
        {transactions.map((tx) => (
          <div key={tx.id} className={styles.card} onClick={()=> onSelect(tx)}>
            
            {/* LEFT: ICON & TYPE */}
            <div className={styles.leftCol}>
              <div className={`${styles.iconBox} ${tx.type === 'DEPOSIT' || tx.type === 'TRADE_WIN' ? styles.iconGreen : styles.iconRed}`}>
                {tx.type === 'DEPOSIT' || tx.type === 'TRADE_WIN' ? '↓' : '↑'}
              </div>
              <div className={styles.meta}>
                <span className={styles.type}>{tx.type.replace('_', ' ')}</span>
                <span className={styles.date}>{formatDate(tx.createdAt)}</span>
              </div>
            </div>

            {/* MIDDLE: HASH / INFO (Optional, hidden on small screens) */}
            <div className={styles.midCol}>
              {tx.symbol && <span className={styles.tokenInfo}>{tx.tokenAmount} {tx.symbol}</span>}
              {tx.status === 'PENDING' && <span className={styles.pendingLabel}>Processing</span>}
            </div>

            {/* RIGHT: AMOUNT & STATUS */}
            <div className={styles.rightCol}>
              <div className={styles.amount}>
                {tx.type === 'WITHDRAWAL' || tx.type === 'TRADE_LOSS' ? '-' : '+'}
                ${tx.amountUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div className={`${styles.statusBadge} ${getStatusClass(tx.status)}`}>
                {tx.status}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};