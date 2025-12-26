import React, { forwardRef } from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'social' | 'text';
  isLoading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
}

function ButtonComponent({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  startIcon, 
  endIcon, 
  fullWidth = false,
  className, 
  disabled = false,
  type = 'button',
  ...props 
}: ButtonProps, ref: React.Ref<HTMLButtonElement>) {
  const variantClass = styles[variant];
  const widthClass = fullWidth ? styles.fullWidth : '';
  const loadingClass = isLoading ? styles.loading : '';

  return (
    <button
      ref={ref}
      type={type}
      className={[
        styles.button,
        variantClass,
        widthClass,
        loadingClass,
        className ?? '',
        disabled ? styles.disabled : '',
      ].join(' ')}
      disabled={disabled}
      {...props}
      onClick={disabled ? ()=> {} : props.onClick}
    >
      {isLoading && (
        <span className={styles.spinner}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className={styles.spinnerPath} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          </svg>
        </span>
      )}

      <span className={styles.content}>
        {startIcon && <span className={styles.startIcon}>{startIcon}</span>}
        <span className={styles.label}>{children}</span>
        {endIcon && <span className={styles.endIcon}>{endIcon}</span>}
      </span>
    </button>
  );
}

const Button = forwardRef(ButtonComponent);
export default Button;