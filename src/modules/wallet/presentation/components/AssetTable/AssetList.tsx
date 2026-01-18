import type { Asset } from 'src/modules/wallet/domain/wallet.types';
import styles from './AssetList.module.css';
import { useAuth } from 'src/shared/presentation/hooks/useAuth';
import { UserRoleHelper } from 'src/shared/presentation/helpers/user-role.helper';
import Button from 'src/shared/presentation/components/Button/Button';

interface AssetListProps {
  assets: Asset[];
  // balances: Record<string, number>;
  isTraderWallet?: boolean;
  onDeposit?: (symbol: string) => void;
  onWithdraw?: (symbol: string) => void;
  onDebit?: (symbol: string) => void;
  onCredit?: (symbol: string) => void;
}

export const AssetList = ({ assets, isTraderWallet = false, onDeposit, onWithdraw, onCredit, onDebit }: AssetListProps) => {
  const { profile } = useAuth();
  const isAdmin = UserRoleHelper.isAdmin(profile!.role);

  return (
    <div className={styles.container}>
      {assets.map((asset) => {
        const balance = 0;
        const fiatValue = 0;

        return (
          <div key={asset.symbol} className={styles.card}>
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
              {isAdmin && !isTraderWallet ? (
                <>
                  <Button variant="secondary" onClick={() => onDebit?.(asset.symbol)}> Debit </Button>
                  <Button variant="primary" onClick={() => onCredit?.(asset.symbol)}> Credit </Button>
                </>
              ) : (
                <>
                  {
                    asset.isDepositEnabled
                    ? <Button variant="secondary" onClick={() => onWithdraw?.(asset.symbol)}>Withdrawal</Button>
                    : null
                  }
                  
                  {
                    asset.isDepositEnabled
                    ? <Button 
                        variant="primary" 
                        onClick={() => onDeposit?.(asset.symbol)}
                      >
                        Deposit
                      </Button>
                    : null
                  }
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};