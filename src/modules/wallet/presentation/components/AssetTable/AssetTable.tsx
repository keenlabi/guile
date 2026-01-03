import type { AssetConfig } from 'src/modules/wallet/domain/wallet.types';
import styles from './AssetTable.module.css';
import Button from 'src/shared/presentation/components/Button/Button';

interface AssetTableProps {
  assets: AssetConfig[];
  balances: Record<string, number>;
  onDeposit: (symbol: string) => void;
  onTrade: (symbol: string) => void;
}

export const AssetTable = ({ assets, balances, onDeposit, onTrade }: AssetTableProps) => {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Asset</th>
            <th align="right">Balance</th>
            <th align="right">Value (USD)</th>
            <th align="right">Action</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => {
            const balance = balances[asset.symbol] || 0;
            // Mock price for now (since we don't have a Market module yet)
            const mockPrice = asset.symbol === 'USD' ? 1 : 50000; 
            const value = balance * mockPrice;

            return (
              <tr key={asset.symbol}>
                <td>
                  <div className={styles.assetName}>
                    {asset.iconUrl && (
                      <img src={asset.iconUrl} alt={asset.symbol} className={styles.icon} width={24} height={24} />
                    )}
                    <div className={styles.nameWrapper}>
                      <span className={styles.symbol}>{asset.symbol}</span>
                      <span className={styles.name}>{asset.name}</span>
                    </div>
                  </div>
                </td>
                <td align="right">{balance.toFixed(asset.decimals > 2 ? 4 : 2)}</td>
                <td align="right">${value.toLocaleString()}</td>
                <td align="right">
                  {asset.isDepositEnabled && (
                    <Button 
                      variant="text" 
                      onClick={() => onDeposit(asset.symbol)}
                      style={{ color: 'var(--brand-green)', fontWeight: 'bold' }}
                    >
                      Deposit
                    </Button>
                  )}
                  {asset.isTradingEnabled && (
                    <Button variant="text" onClick={() => onTrade(asset.symbol)}>
                      Trade
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};