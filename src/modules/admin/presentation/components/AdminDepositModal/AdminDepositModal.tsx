import { useState } from 'react';
import { useForm } from 'react-hook-form';
// import { walletRepository } from 'src/modules/wallet/infrastructure/repositories/wallet.repository';
import InputField from 'src/shared/presentation/components/FormFields/InputField/InputField';
import DropdownField from 'src/shared/presentation/components/FormFields/DropDownField/DropDownField';
import Button from 'src/shared/presentation/components/Button/Button';
import Form from 'src/shared/presentation/components/FormFields/Form/Form';
import styles from './AdminDepositModal.module.css';

interface AdminDepositModalProps {
  userId: string; // The ID of the user we are crediting
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

  if (!isOpen) return null;

  const onSubmit = async (/**data: DepositFormData**/) => {
    setLoading(true);
    setError(null);
    try {
      // Note: Assuming your backend can take userId directly, 
      // or you might need to fetch the email first if your repo strictly requires email.
      // For this implementation, we assume the repo was updated to accept ID or we pass a dummy email.
      // await walletRepository.adminCreditUser(userId, data.symbol, Number(data.amount));
      onSuccess();
    } catch (err: unknown) {

      setError((err as { message: string}).message || 'Failed to credit wallet');
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

        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

        <Form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.summary}>
            Target User ID: <strong>{userId}</strong>
          </div>

          <DropdownField
            label="Asset"
            options={[
              { label: 'Bitcoin (BTC)', value: 'BTC' },
              { label: 'Ethereum (ETH)', value: 'ETH' },
              { label: 'Tether (USDT)', value: 'USDT' },
              { label: 'Fiat USD', value: 'USD' },
            ]}
            error={errors.symbol?.message}
            {...register('symbol', { required: 'Required' })}
          />

           <InputField
             label="Amount"
             type="number"
             step="any"
             placeholder="0.00"
             error={errors.amount?.message}
             {...register('amount', { required: 'Required', min: 0 })}
           />

           <Button type="submit" variant="primary" isLoading={loading} fullWidth>
             Confirm Credit
           </Button>
        </Form>
      </div>
    </div>
  );
};