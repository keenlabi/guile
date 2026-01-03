import { useEffect, useState } from 'react';
import type { AssetConfig } from '../../domain/wallet.types';
import { walletRepository } from '../../infrastructure/repositories/wallet.repository';
import { useToast } from 'src/shared/presentation/hooks/useToast';
import { AppHeader } from 'src/shared/presentation/components/AppHeader/AppHeader';
import { AssetTable } from '../components/AssetTable/AssetTable';

export const PortfolioPage = () => {
  const [assets, setAssets] = useState<AssetConfig[]>([]);
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const { showSuccess, showError }  = useToast();

  const fetchData = async () => {
    try {
      const [assetsData, walletData] = await Promise.all([
        walletRepository.getAssets(),
        walletRepository.getMyWallet()
      ]);
      setAssets(assetsData);
      setBalances(walletData.assets);
    } catch (error) {
      showError(error, "Failed to load portfolio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeposit = async (symbol: string) => {
    // For MVP Simulation: Direct deposit
    if (symbol === 'USD' || symbol === 'USDT') {
      try {
        await walletRepository.simulateDeposit(10000);
        showSuccess(`Simulated deposit of 10,000 ${symbol}`);
        fetchData(); // Refresh balances
      } catch (error) {
        showError(error, "Deposit failed");
      }
    } else {
      showError("Only USD/USDT deposits enabled for simulation");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <AppHeader title="Portfolio" showCreateButton={false} />
      <div style={{ padding: '3.2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <AssetTable 
          assets={assets} 
          balances={balances} 
          onDeposit={handleDeposit}
          onTrade={() => {}}
        />
      </div>
    </>
  );
};