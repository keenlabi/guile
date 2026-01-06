import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { adminRepository } from 'src/modules/admin/infrastructure/repositories/admin.repository';
import type { Wallet } from 'src/modules/wallet/domain/wallet.types';
import { AssetList } from 'src/modules/wallet/presentation/components/AssetTable/AssetList';
import Button from 'src/shared/presentation/components/Button/Button';
import { useToast } from 'src/shared/presentation/hooks/useToast';
import { AdminDepositModal } from '../../../components/AdminDepositModal/AdminDepositModal';
import { AdminCreditModal } from '../../../components/AdminCreditModal/AdminCreditModal';
import { AdminDebitModal } from '../../../components/AdminDebitModal/AdminDebitModal';

export const TraderWalletsPage = () => {
  const { id } = useParams<{ id: string }>();
  
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isDepositModalOpen, setDepositModalOpen] = useState(false);
  const { showSuccess } = useToast();
  const [creditSymbol, setCreditSymbol] = useState<string | null>(null);
  const [debitSymbol, setDebitSymbol] = useState<string | null>(null);

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

  const handleDebitSuccess = () => {
    showSuccess("Wallet debited successfully");
    setDebitSymbol(null);
    fetchWallet();
  };

  if (!wallet) return <div>Loading Wallets...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 600 }}>Assets & Balances</h2>
        <Button onClick={() => setDepositModalOpen(true)}>
          + Credit Balance
        </Button>
      </div>

      {/* Reusing AssetList but disabling user actions since we are admin */}
      {/* <div style={{ opacity: 0.8, pointerEvents: 'none' }}> */}
        <AssetList
          assets={wallet.assets}
          onCredit={(symbol)=> setCreditSymbol(symbol)}
          onDebit={(symbol)=> setDebitSymbol(symbol)}
        />
      {/* </div> */}

      {isDepositModalOpen && id && (
        <AdminDepositModal
          userId={id}
          isOpen={isDepositModalOpen}
          onClose={() => setDepositModalOpen(false)}
          onSuccess={handleCreditSuccess}
        />
      )}

      {creditSymbol && id && (
        <AdminCreditModal
          userId={id}
          symbol={creditSymbol}
          isOpen={!!creditSymbol}
          onClose={() => setCreditSymbol(null)}
          onSuccess={handleCreditSuccess}
        />
      )}

      {debitSymbol && id && (
        <AdminDebitModal
          userId={id}
          symbol={debitSymbol}
          isOpen={!!debitSymbol}
          onClose={() => setDebitSymbol(null)}
          onSuccess={handleDebitSuccess}
        />
      )}
    </div>
  );
};