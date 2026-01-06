import styles from './DepositModal.module.css';
import Button from 'src/shared/presentation/components/Button/Button';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetName: string;
  symbol: string;
  network: string;
  address: string;
}

export function DepositModal({ isOpen, onClose, assetName, symbol, network, address }: DepositModalProps) {
  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Deposit {assetName}</h2>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        <div className={styles.warning}>
          Only send <strong>{symbol} ({network})</strong> to this address. 
          Sending any other asset may result in permanent loss.
        </div>

        <div className={styles.qrContainer}>
           <div className={styles.qrPlaceholder}>[ QR Code ]</div>
        </div>

        <div className={styles.addressGroup}>
          <label className={styles.label}>Wallet Address</label>
          <div className={styles.addressBox}>
            <span className={styles.addressText}>{address}</span>
            <button className={styles.copyBtn} onClick={handleCopy}>Copy</button>
          </div>
        </div>

        <Button onClick={onClose} variant="secondary" fullWidth>Done</Button>
      </div>
    </div>
  );
}