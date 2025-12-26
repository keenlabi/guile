import { useState } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import InputField from '../../../../../shared/presentation/components/FormFields/InputField/InputField';
import EyeSlashIcon from '../../../../../shared/presentation/assets/icons/eye-slash.svg?react';
import EyeOpenIcon from '../../../../../shared/presentation/assets/icons/eye-open.svg?react';
import styles from "./PasswordField.module.css";

interface PasswordFieldProps {
  register: UseFormRegisterReturn<"password">;
  error?: string;
  containerClassName?: string;
  iconBtnClassName?: string;
  placeholder?: string;
  label?: string;
}

export default function PasswordField({
  register,
  error,
  containerClassName,
  iconBtnClassName,
  placeholder = 'Enter Password',
  label = '',
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputField
      label={label}
      placeholder={placeholder}
      type={showPassword ? 'text' : 'password'}
      error={error}
      suffixIcon={
        <button
          type="button"
          className={iconBtnClassName ?? styles.iconBtn}
          onClick={() => setShowPassword(prev => !prev)}
          tabIndex={-1}
        >
          {showPassword ? <EyeOpenIcon /> : <EyeSlashIcon />}
        </button>
      }
      containerClassName={containerClassName ?? styles.inputSpacing}
      {...register}
    />
  );
}