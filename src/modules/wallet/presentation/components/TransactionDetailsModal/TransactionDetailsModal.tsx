import styles from './TransactionDetailsModal.module.css';
import type { Transaction } from '../../../domain/wallet.types';

interface Props {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionDetailsModal = ({ transaction, isOpen, onClose }: Props) => {
  if (!isOpen || !transaction) return null;
console.log(isOpen, transaction)
  // Prevent clicking backdrop closing if we click inside content
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return styles.textGreen;
      case 'PENDING': return styles.textYellow;
      case 'FAILED': return styles.textRed;
      default: return styles.textGrey;
    }
  };

  const isPositive = transaction.type === 'DEPOSIT' || transaction.type === 'TRADE_WIN';

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={handleContentClick}>
        
        {/* HEADER */}
        <div className={styles.header}>
          <h3>Transaction Details</h3>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        {/* MAIN AMOUNT */}
        <div className={styles.heroSection}>
          <div className={`${styles.iconCircle} ${isPositive ? styles.bgGreen : styles.bgRed}`}>
            {isPositive ? '↓' : '↑'}
          </div>
          <div className={styles.amountWrapper}>
            <span className={isPositive ? styles.textGreen : styles.textRed}>
              {isPositive ? '+' : '-'}${transaction.amountUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className={styles.usdLabel}>USD</span>
          </div>
          <div className={`${styles.statusBadge} ${getStatusColor(transaction.status)}`}>
            {transaction.status}
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className={styles.detailsList}>
          
          <div className={styles.row}>
            <span className={styles.label}>Type</span>
            <span className={styles.value}>{transaction.type.replace('_', ' ')}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Time</span>
            <span className={styles.value}>{new Date(transaction.createdAt).toLocaleString()}</span>
          </div>

          <div className={styles.divider} />

          <div className={styles.row}>
            <span className={styles.label}>Asset</span>
            <span className={styles.value}>{transaction.symbol || 'USD'}</span>
          </div>

          {transaction.tokenAmount && (
            <div className={styles.row}>
              <span className={styles.label}>Quantity</span>
              <span className={styles.value}>{transaction.tokenAmount} {transaction.symbol}</span>
            </div>
          )}

          {transaction.destinationAddress && (
            <div className={styles.row}>
              <span className={styles.label}>Address</span>
              <span className={`${styles.value} ${styles.mono} ${styles.breakAll}`}>
                {transaction.destinationAddress}
              </span>
            </div>
          )}

          <div className={styles.row}>
            <span className={styles.label}>Transaction ID</span>
            <span className={`${styles.value} ${styles.mono}`}>{transaction.id}</span>
          </div>

          {transaction.txHash && (
             <div className={styles.row}>
               <span className={styles.label}>Tx Hash</span>
               <a 
                 href={`#`} // Ideally link to Etherscan/BscScan based on symbol
                 className={`${styles.value} ${styles.link} ${styles.mono} ${styles.breakAll}`}
                 target="_blank" 
                 rel="noreferrer"
               >
                 {transaction.txHash}
               </a>
             </div>
          )}
        </div>

      </div>
    </div>
  );
};