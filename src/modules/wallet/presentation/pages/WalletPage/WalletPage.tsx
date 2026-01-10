import { useEffect, useState, useCallback } from 'react';
import styles from './WalletPage.module.css';

// --- DOMAIN & REPO ---

// --- COMPONENTS ---

// --- SHARED ---
import { useToast } from 'src/shared/presentation/hooks/useToast';
import type { Asset, Transaction, Wallet } from 'src/modules/wallet/domain/wallet.types';
import { walletRepository } from 'src/modules/wallet/infrastructure/repositories/wallet.repository';
import { TransactionList } from '../../components/TransactionList/TransactionList';
import { DepositModal } from '../../components/DepositModal/DepositModal';
import { WithdrawModal } from '../../components/WithdrawModal/WithdrawModal';
import { TransactionDetailsModal } from '../../components/TransactionDetailsModal/TransactionDetailsModal';

export const WalletPage = () => {
  const { showError } = useToast();
  
  // --- STATE ---
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // --- MODAL CONTROLS ---
  const [selectedDepositAsset, setSelectedDepositAsset] = useState<Asset | null>(null);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // --- DATA FETCHING ---
  const fetchData = useCallback(async () => {
    try {
      // Keep loading state mainly for initial load, to avoid flickering on refresh
      if (!wallet) setLoading(true); 

      const [walletData, assetsData, txData] = await Promise.all([
        walletRepository.getMyWallet(),
        walletRepository.getAssets(),
        walletRepository.getTransactions()
      ]);
      
      setWallet(walletData);
      setAssets(assetsData);
      setTransactions(txData);
      
    } catch (error) {
      showError(error, "Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  }, [showError, wallet]);

  // Initial Load
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // --- HANDLERS ---
  const handleDepositClick = (asset: Asset) => {
    if (!asset.isDepositEnabled) {
      showError("Deposits are temporarily disabled for this asset");
      return;
    }
    setSelectedDepositAsset(asset);
  };

  const handleRefresh = () => {
    fetchData();
  };

  const depositAssets = assets.filter(a => a.isDepositEnabled);

  if (loading) {
    return <div className={styles.loadingContainer}>Loading Wallet...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>My Wallet</h1>
      
      {/* 1. WALLET PANEL (Balance + Actions) */}
      <div className={styles.walletPanel}>
        
        {/* TOP: BALANCE SECTION */}
        <div className={styles.balanceSection}>
          <div className={styles.headerRow}>
            <div className={styles.headerLeft}>
              <span className={styles.label}>Total Equity</span>
              <span className={styles.statusPill}>Active</span>
            </div>
            
            {/* Action Buttons */}
            <button 
              className={styles.withdrawBtn}
              onClick={() => setIsWithdrawOpen(true)}
            >
              Withdraw
            </button>
          </div>
          
          <div className={styles.balanceRow}>
            <span className={styles.symbol}>$</span>
            <span className={styles.amount}>
              {wallet?.usdBalance?.toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              }) || '0.00'}
            </span>
            <span className={styles.currency}>USD</span>
          </div>
          <div className={styles.subtext}>Available for trade</div>
        </div>

        {/* DIVIDER */}
        <div className={styles.divider} />

        {/* BOTTOM: QUICK DEPOSIT LIST */}
        <div className={styles.depositSection}>
          <span className={styles.depositLabel}>Quick Deposit via</span>
          
          <div className={styles.assetGrid}>
            {depositAssets.map((asset) => (
              <button 
                key={asset.symbol} 
                className={styles.assetCard}
                onClick={() => handleDepositClick(asset)}
                title={`Deposit ${asset.name}`}
              >
                <div className={styles.iconWrapper}>
                  {asset.iconUrl ? (
                    <img src={asset.iconUrl} alt={asset.symbol} className={styles.assetIcon} />
                  ) : (
                    <div className={styles.placeholderIcon}>{asset.symbol[0]}</div>
                  )}
                </div>
                <div className={styles.assetInfo}>
                    <span className={styles.assetSymbol}>{asset.symbol}</span>
                    <span className={styles.networkLabel}>{asset.type}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. TRANSACTION HISTORY */}
      <TransactionList 
        transactions={transactions} 
        isLoading={loading} 
        onSelect={(tx) => setSelectedTransaction(tx)}
      />

      {/* --- MODALS --- */}
      
      {/* Deposit Modal */}
      {selectedDepositAsset && (
        <DepositModal
          isOpen={!!selectedDepositAsset}
          onClose={() => setSelectedDepositAsset(null)}
          assetName={selectedDepositAsset.name}
          symbol={selectedDepositAsset.symbol}
          network={selectedDepositAsset.type} 
          address={selectedDepositAsset.depositAddress || ''}
        />
      )}

      {/* Withdraw Modal */}
      <WithdrawModal 
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        usdBalance={wallet?.usdBalance || 0}
        assets={assets}
        onSuccess={handleRefresh} 
      />

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        isOpen={!!selectedTransaction}
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />

    </div>
  );
};