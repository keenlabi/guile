import type { WalletAsset } from 'src/modules/wallet/domain/wallet.types';
import styles from './AssetList.module.css';
import Button from 'src/shared/presentation/components/Button/Button';
import { useAuth } from 'src/shared/presentation/hooks/useAuth';
import { UserRoleHelper } from 'src/shared/presentation/helpers/user-role.helper';

interface AssetListProps {
  assets: WalletAsset[];
  // balances: Record<string, number>;
  isTraderPortfolio?: boolean;
  onDeposit?: (symbol: string) => void;
  onWithdraw?: (symbol: string) => void;
  onDebit?: (symbol: string) => void;
  onCredit?: (symbol: string) => void;
}

export const AssetList = ({ assets, isTraderPortfolio = false, onDeposit, onWithdraw, onCredit, onDebit }: AssetListProps) => {
  const { profile } = useAuth();
  const isAdmin = UserRoleHelper.isAdmin(profile!.role);

  return (
    <div className={styles.container}>
      {assets.map((asset) => {
        const balance = asset.balance || 0;
        const fiatValue = asset.balanceUsd;

        return (
          <div key={asset.symbol} className={styles.card}>
            {/* Left: Asset Details */}
            <div className={styles.assetInfo}>
              <div className={styles.header}>
                {asset.iconUrl && (
                  <img src={asset.iconUrl} alt={asset.symbol} className={styles.icon} />
                )}
                <span className={styles.assetName}>{asset.name}</span>
                <span className={styles.symbol}>({asset.symbol})</span>
              </div>
              
              <div className={styles.balanceRow}>
                <span className={styles.balance}>
                  {balance.toFixed(8)} <span style={{fontSize: '1.4rem'}}>{asset.symbol}</span>
                </span>
                <span className={styles.fiatValue}>
                  ≈ {fiatValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </span>
              </div>
            </div>

            <div className={styles.actions}>
              {isAdmin && !isTraderPortfolio ? (
                <>
                  <Button variant="secondary" onClick={() => onDebit?.(asset.symbol)}> Debit </Button>
                  <Button variant="primary" onClick={() => onCredit?.(asset.symbol)}> Credit </Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" onClick={() => onWithdraw?.(asset.symbol)}>Withdrawal</Button>
                  <Button variant="primary" onClick={() => onDeposit?.(asset.symbol)}>Deposit</Button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};