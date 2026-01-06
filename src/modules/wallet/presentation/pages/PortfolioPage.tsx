import { useEffect, useState, useMemo } from 'react';
import type { Wallet, WalletAsset } from '../../domain/wallet.types'; // Updated imports
import { walletRepository } from '../../infrastructure/repositories/wallet.repository';
import { useToast } from 'src/shared/presentation/hooks/useToast';
import styles from './PortfolioPage.module.css';
import { AssetList } from '../components/AssetTable/AssetList';
import { DepositModal } from '../components/DepositModal/DepositModal';

export const PortfolioPage = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null); // Changed state
  const [loading, setLoading] = useState(true);
  
  const [selectedAssetForDeposit, setSelectedAssetForDeposit] = useState<WalletAsset | null>(null);

  const { showError }  = useToast();

  const fetchData = async () => {
    try {
      const data = await walletRepository.getMyWallet();
      setWallet(data);
    } catch (error) { 
      showError(error, "Failed to load portfolio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate Total Balance (or use wallet.usdBalance from backend if preferred)
  const totalBalanceUSD = useMemo(() => {
    if (!wallet) return 0;
    // Use backend total if reliable, otherwise recalc:
    // return wallet.usdBalance; 
    
    // Frontend Recalc example (using mock prices for now):
    return wallet.assets.reduce((total, asset) => {
       let price = 0;
       if (['USD', 'USDT', 'USDC'].includes(asset.symbol)) price = 1;
       else if (asset.symbol === 'BTC') price = 96000;
       else if (asset.symbol === 'ETH') price = 3600;
       else if (asset.symbol === 'SOL') price = 200;
       
       return total + (asset.balance * price);
    }, 0);
  }, [wallet]);

  // Open modal with the specific asset data
  const handleDeposit = (symbol: string) => {
    const asset = wallet?.assets.find(a => a.symbol === symbol);
    if (asset) {
      setSelectedAssetForDeposit(asset);
    }
  };

  const handleWithdraw = (symbol: string) => {
    showError("Withdrawals disabled");
  }
  // const handleTransfer = (symbol: string) => showError("Transfers disabled");

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Crypto wallet</h1>
        <div className={styles.totalBalanceWrapper}>
          <span className={styles.totalBalanceLabel}>Total balance</span>
          <div className={styles.totalBalanceValue}>
            {totalBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
            <span className={styles.currencyCode}> USD</span>
          </div>
        </div>
      </header>

      {/* Tabs & Filters ... (Unchanged) */}

      {/* Asset List - Pass the wallet assets directly */}
      <AssetList
        assets={wallet?.assets || []}
        isTraderPortfolio={true}
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
      />

      {/* Deposit Modal - Now receives the address directly! */}
      {selectedAssetForDeposit && (
        <DepositModal
          isOpen={!!selectedAssetForDeposit}
          onClose={() => setSelectedAssetForDeposit(null)}
          assetName={selectedAssetForDeposit.name}
          symbol={selectedAssetForDeposit.symbol}
          network={selectedAssetForDeposit.symbol === 'BTC' ? 'Bitcoin' : 'ERC-20'} // Simple logic for now
          address={selectedAssetForDeposit.depositAddress}
        />
      )}
    </div>
  );
};