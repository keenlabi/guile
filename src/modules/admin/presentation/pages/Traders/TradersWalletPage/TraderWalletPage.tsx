import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { adminRepository } from 'src/modules/admin/infrastructure/repositories/admin.repository';
import type { Wallet } from 'src/modules/wallet/domain/wallet.types';
import Button from 'src/shared/presentation/components/Button/Button';
import { useToast } from 'src/shared/presentation/hooks/useToast';
import { AdminDepositModal } from '../../../components/AdminDepositModal/AdminDepositModal';
import { formatCurrency } from 'src/shared/utils/format.utils';
import styles from './TraderWalletPage.module.css';

export const TraderWalletsPage = () => {
  const { id } = useParams<{ id: string }>();
  
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isDepositModalOpen, setDepositModalOpen] = useState(false);
  const { showSuccess } = useToast();

  // Note: Unused states (credit/debit) removed for cleanliness 
  // based on the simplified view you requested.

  const fetchWallet = useCallback(() => {
    if (id) {
      adminRepository.getTraderWallet(id).then(setWallet);
    }
  }, [id]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet, id]);

  const handleCreditSuccess = () => {
    showSuccess("Wallet credited successfully");
    setDepositModalOpen(false);
    fetchWallet(); // Refresh balances
  };

  if (!wallet) {
    return <div className={styles.loading}>Loading Wallet...</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Wallet Overview</h2>

      {/* BALANCE CARD */}
      <div className={styles.balanceCard}>
        <div>
          <div className={styles.label}>Total Equity</div>
          <div className={styles.amount}>
            {formatCurrency(wallet.usdBalance)}
            <span className={styles.currency}>USD</span>
          </div>
        </div>

        <div>
          <Button variant="primary" onClick={() => setDepositModalOpen(true)}>
            + Credit / Deposit
          </Button>
        </div>
      </div>

      {/* Admin Deposit Modal */}
      {isDepositModalOpen && id && (
        <AdminDepositModal
          userId={id}
          isOpen={isDepositModalOpen}
          onClose={() => setDepositModalOpen(false)}
          onSuccess={handleCreditSuccess}
        />
      )}
    </div>
  );
};