import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import styles from './AdminTradeModal.module.css';
import { walletRepository } from 'src/modules/wallet/infrastructure/repositories/wallet.repository';
import { predictionRepository } from 'src/modules/prediction/infrastructure/repositories/prediction.repository';
import { useToast } from 'src/shared/presentation/hooks/useToast';
import type { Asset } from 'src/modules/wallet/domain/wallet.types';
import Button from 'src/shared/presentation/components/Button/Button';
import InputField from 'src/shared/presentation/components/FormFields/InputField/InputField';
import DropdownField from 'src/shared/presentation/components/FormFields/DropDownField/DropDownField';
import Form from 'src/shared/presentation/components/FormFields/Form/Form';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess: () => void;
}

interface TradeFormData {
  symbol: string;
  amount: number;
  duration: number;
}

export const AdminTradeModal = ({ isOpen, onClose, userId, onSuccess }: Props) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<TradeFormData>({
    defaultValues: { duration: 60 } // Default 1 min
  });
  
  const [direction, setDirection] = useState<'HIGH' | 'LOW'>('HIGH');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  // Fetch Assets for Dropdown
  useEffect(() => {
    if (isOpen) {
      walletRepository.getAssets().then(setAssets).catch(console.error);
    }
  }, [isOpen]);

  const assetOptions = useMemo(() => 
    assets.map(a => ({ label: `${a.name} (${a.symbol})`, value: a.symbol })), 
  [assets]);

  const onSubmit = async (data: TradeFormData) => {
    setLoading(true);
    try {
      await predictionRepository.adminPlacePrediction({
        userId,
        symbol: data.symbol,
        amount: Number(data.amount),
        duration: Number(data.duration),
        direction
      });
      showSuccess("AI Trade Placed Successfully");
      onSuccess();
    } catch (err: any) {
      showError(err.message || "Failed to place trade");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>⚡ Force AI Trade</h2>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        <Form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          
          {/* 1. Asset & Amount */}
          <div className={styles.row}>
            <DropdownField
              label="Asset"
              options={assetOptions}
              error={errors.symbol?.message}
              {...register('symbol', { required: 'Required' })}
            />
            <InputField
              label="Amount ($)"
              type="number"
              error={errors.amount?.message}
              {...register('amount', { required: 'Required', min: 1 })}
            />
          </div>

          {/* 2. Duration Preset Buttons */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Duration</label>
            <div className={styles.durationRow}>
              {[60, 180, 300].map(sec => (
                <button
                  key={sec}
                  type="button"
                  className={`${styles.durBtn} ${watch('duration') === sec ? styles.activeDur : ''}`}
                  onClick={() => setValue('duration', sec)}
                >
                  {sec / 60}m
                </button>
              ))}
              <input 
                type="number" 
                className={styles.hiddenInput}
                {...register('duration', { required: true })}
              />
            </div>
          </div>

          {/* 3. High / Low Toggle */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Direction</label>
            <div className={styles.toggleRow}>
              <button
                type="button"
                className={`${styles.dirBtn} ${direction === 'HIGH' ? styles.btnHigh : ''}`}
                onClick={() => setDirection('HIGH')}
              >
                HIGH ▲
              </button>
              <button
                type="button"
                className={`${styles.dirBtn} ${direction === 'LOW' ? styles.btnLow : ''}`}
                onClick={() => setDirection('LOW')}
              >
                LOW ▼
              </button>
            </div>
          </div>

          <Button type="submit" variant="primary" isLoading={loading} fullWidth>
            Execute Trade
          </Button>
        </Form>
      </div>
    </div>
  );
};