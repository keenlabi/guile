import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './AdminDebitModal.module.css';
import InputField from 'src/shared/presentation/components/FormFields/InputField/InputField';
import Button from 'src/shared/presentation/components/Button/Button';
import Form from 'src/shared/presentation/components/FormFields/Form/Form';
import { adminRepository } from 'src/modules/admin/infrastructure/repositories/admin.repository';
import { parseError } from 'src/shared/presentation/helpers/error.helper';

interface Props {
  userId: string;
  symbol: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminDebitModal = ({ userId, symbol, isOpen, onClose, onSuccess }: Props) => {
  const { register, handleSubmit, formState: { errors } } = useForm<{ amountUsd: number }>();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: { amountUsd: number }) => {
    setLoading(true);
    setApiError(null);
    try {
      await adminRepository.debitUserWallet(userId, symbol, data.amountUsd);
      onSuccess();
    } catch (err) {
      setApiError(parseError(err) || "Failed to debit wallet.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Debit {symbol}</h2>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>
        
        <p className={styles.description}>
          Enter the amount of <strong>{symbol}</strong> to deduct from the user's balance.
        </p>
        
        {apiError && <div className={styles.errorBanner}>{apiError}</div>}

        <Form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <InputField 
            label={`Amount to Deduct (${symbol})`}
            type="number"
            step="any"
            placeholder="0.00"
            error={errors.amountUsd?.message}
            {...register('amountUsd', { 
              required: 'Amount is required', 
              min: { value: 0.000001, message: 'Amount must be greater than 0' } 
            })}
          />
          
          <div className={styles.warningBox}>
            <strong>Warning:</strong> This action will immediately decrease the user's available balance.
          </div>

          <div className={styles.buttonGroup}>
            <Button variant="secondary" onClick={onClose} fullWidth>Cancel</Button>
            <Button type="submit" isLoading={loading} fullWidth style={{ backgroundColor: 'var(--brand-red)' }}>
              Confirm Debit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};