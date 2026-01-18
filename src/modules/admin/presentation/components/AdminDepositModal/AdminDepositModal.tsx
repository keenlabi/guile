import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import InputField from 'src/shared/presentation/components/FormFields/InputField/InputField';
import DropdownField from 'src/shared/presentation/components/FormFields/DropDownField/DropDownField';
import Button from 'src/shared/presentation/components/Button/Button';
import Form from 'src/shared/presentation/components/FormFields/Form/Form';
import styles from './AdminDepositModal.module.css';
import { walletRepository } from 'src/modules/wallet/infrastructure/repositories/wallet.repository';
import { adminRepository } from 'src/modules/admin/infrastructure/repositories/admin.repository';
import type { Asset } from 'src/modules/wallet/domain/wallet.types';

interface AdminDepositModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface DepositFormData {
  symbol: string;
  amount: number;
}

export const AdminDepositModal = ({ userId, isOpen, onClose, onSuccess }: AdminDepositModalProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<DepositFormData>();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 1. State for Assets
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);

  // 2. Fetch Assets on Mount/Open
  useEffect(() => {
    if (isOpen) {
      const fetchAssets = async () => {
        setLoadingAssets(true);
        try {
          const data = await walletRepository.getAssets();
          setAssets(data);
        } catch (err) {
          console.error("Failed to fetch assets", err);
          setError("Failed to load asset list");
        } finally {
          setLoadingAssets(false);
        }
      };
      fetchAssets();
    }
  }, [isOpen]);

  // 3. Transform Assets to Dropdown Options
  const assetOptions = useMemo(() => {
    // Basic Assets
    const list = assets.map(asset => ({
      label: `${asset.name} (${asset.symbol})`,
      value: asset.symbol
    }));

    // Optional: Ensure 'USD' is always an option if your backend supports direct Fiat credit
    // If 'USD' comes from the backend assets list, you can remove this manual push.
    const hasUSD = list.some(a => a.value === 'USD');
    if (!hasUSD) {
      list.unshift({ label: 'Fiat USD Balance', value: 'USD' });
    }

    return list;
  }, [assets]);

  if (!isOpen) return null;

  const onSubmit = async (data: DepositFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      // 4. Use the data from the form
      await adminRepository.creditUserWallet(
        userId, 
        data.symbol, 
        Number(data.amount) // Ensure number
      );
      
      onSuccess(); // Close and refresh parent
    } catch (err: unknown) {
      setError((err as { message: string }).message || 'Failed to credit wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Credit User Balance</h2>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        {error && <div style={{ color: '#f6465d', marginBottom: '1rem', fontSize: '14px' }}>{error}</div>}

        <Form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.summary}>
            Target User ID: <strong style={{color: '#EAECEF'}}>{userId}</strong>
          </div>

          <DropdownField
            label="Asset"
            options={assetOptions}
            placeholder={loadingAssets ? "Loading assets..." : "Select Asset"}
            error={errors.symbol?.message}
            {...register('symbol', { required: 'Required' })}
          />

           <InputField
             label="Amount"
             type="number"
             step="any"
             placeholder="0.00"
             error={errors.amount?.message}
             {...register('amount', { 
               required: 'Required', 
               min: { value: 0.01, message: "Amount must be positive" } 
             })}
           />

           <Button type="submit" variant="primary" isLoading={loading} fullWidth>
             Confirm Credit
           </Button>
        </Form>
      </div>
    </div>
  );
};