import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './AdminCreditModal.module.css';
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

export const AdminCreditModal = ({ userId, symbol, isOpen, onClose, onSuccess }: Props) => {
  const { register, handleSubmit } = useForm<{ amountUsd: number }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data: { amountUsd: number }) => {
    setLoading(true);
    try {
      await adminRepository.creditUserWalletNaira(userId, symbol, data.amountUsd);
      onSuccess();
    } catch (error) {
      const message = parseError(error);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Credit {symbol}</h2>
        <p>Enter the amount in Naira to credit the user.</p>
        
        <Form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <InputField 
            label="Amount (USD)"
            type="number"
            placeholder="e.g. 50000"
            {...register('amountUsd', { required: true })}
          />

          {<div className={styles.error}>{error}</div>}
{/*           
          <div className={styles.estimate}>
            Estimated {symbol} to be received: <strong>{estimatedToken}</strong>
          </div> */}

          <Button type="submit" isLoading={loading} fullWidth>Confirm Credit</Button>
          <Button variant="text" onClick={onClose} fullWidth>Cancel</Button>
        </Form>
      </div>
    </div>
  );
};