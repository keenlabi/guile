import { useState, useMemo } from 'react';
import styles from './WithdrawModal.module.css';
import { walletRepository } from '../../../infrastructure/repositories/wallet.repository';
import type { Asset } from '../../../domain/wallet.types';
import { useToast } from 'src/shared/presentation/hooks/useToast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  usdBalance: number;
  assets: Asset[];
  onSuccess: () => void;
}

export const WithdrawModal = ({ isOpen, onClose, usdBalance, assets, onSuccess }: Props) => {
  const { showSuccess, showError } = useToast();
  
  const [selectedSymbol, setSelectedSymbol] = useState<string>(assets[0]?.symbol || 'BTC');
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Filter tradeable assets
  const availableAssets = useMemo(() => assets.filter(a => a.isTradingEnabled), [assets]);
  const activeAsset = availableAssets.find(a => a.symbol === selectedSymbol) || availableAssets[0];

  // --- VALIDATION LOGIC ---
  const numAmount = parseFloat(amount);
  const isAmountValid = !isNaN(numAmount) && numAmount > 0 && numAmount <= usdBalance;
  const isAddressValid = address.trim().length >= 10; // Basic length check
  
  const isValid = isAmountValid && isAddressValid;

  const handleSubmit = async () => {
    if (!isValid) return;

    setIsLoading(true);

    try {
      await walletRepository.requestWithdrawal({
        symbol: selectedSymbol,
        amountUsd: numAmount,
        destinationAddress: address
      });

      showSuccess("Withdrawal requested successfully");
      onSuccess();
      handleClose();
      
    } catch (error) {
      showError(error, "Withdrawal failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setAddress('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={handleClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        
        <div className={styles.header}>
          <h3>Withdraw Funds</h3>
          <button className={styles.closeBtn} onClick={handleClose}>&times;</button>
        </div>

        <div className={styles.body}>
          
          {/* 1. ASSET SELECTION */}
          <div className={styles.inputGroup}>
            <label>Withdraw as</label>
            <div className={styles.selectWrapper}>
              {activeAsset?.iconUrl && <img src={activeAsset.iconUrl} alt="" className={styles.assetIcon} />}
              <select 
                value={selectedSymbol} 
                onChange={e => setSelectedSymbol(e.target.value)}
                className={styles.select}
              >
                {availableAssets.map(asset => (
                  <option key={asset.symbol} value={asset.symbol}>
                    {asset.name} ({asset.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. AMOUNT INPUT */}
          <div className={styles.inputGroup}>
            <div className={styles.labelRow}>
              <label>Amount (USD)</label>
              <span className={styles.maxLabel} onClick={() => setAmount(usdBalance.toString())}>
                Max: ${usdBalance.toFixed(2)}
              </span>
            </div>
            <div className={styles.inputWrapper}>
              <span className={styles.prefix}>$</span>
              <input 
                type="number" 
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className={`${styles.input} ${amount && !isAmountValid ? styles.errorBorder : ''}`}
                placeholder="0.00"
              />
            </div>
            {amount && numAmount > usdBalance && (
               <span className={styles.errorText}>Insufficient funds</span>
            )}
          </div>

          {/* 3. ADDRESS INPUT */}
          <div className={styles.inputGroup}>
            <label>Destination Address ({selectedSymbol})</label>
            <input 
              type="text" 
              value={address}
              onChange={e => setAddress(e.target.value)}
              className={`${styles.input} ${styles.addressInput}`}
              placeholder={`Enter your ${selectedSymbol} wallet address`}
            />
          </div>

          <div className={styles.notice}>
            Request will be processed within 24 hours.
          </div>

          <button 
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={!isValid || isLoading} // <--- Disable logic
          >
            {isLoading ? 'Processing...' : 'Confirm Withdrawal'}
          </button>

        </div>
      </div>
    </div>
  );
};