import React, { forwardRef } from 'react';
import styles from './InputField.module.css';

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
  hint?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  containerClassName?: string;
  wrapperClassName?: string; // New Prop
  width?: string;
  placeholder?: string;
}

function InputFieldComponent({ 
    label, 
    error, 
    hint,
    prefixIcon, 
    suffixIcon, 
    className, 
    containerClassName, 
    wrapperClassName, // Destructure new prop
    width,
    id,
    placeholder,
    ...props 
  }: InputFieldProps, ref: React.Ref<HTMLInputElement>) {
  
  const inputId = id || props.name || label?.replace(/\s+/g, '-').toLowerCase() || placeholder?.replace(/\s+/g, '-').toLowerCase();

  return (
    <div 
      className={`${styles.container} ${containerClassName || ''}`} 
      style={{ width }}
    >
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      
      {/* Applied wrapperClassName here */}
      <div className={`
        ${styles.inputWrapper} 
        ${wrapperClassName || ''}
        ${error ? styles.wrapperError : ''} 
        ${props.disabled || props.readOnly ? styles.wrapperDisabled : ''}
      `}>
        {prefixIcon && <span className={styles.prefixIcon}>{prefixIcon}</span>}
        
        <input
          ref={ref}
          id={inputId}
          className={`${styles.input} ${className || ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          placeholder={placeholder}
          {...props}
        />
        
        {suffixIcon && <span className={styles.suffixIcon}>{suffixIcon}</span>}
      </div>

      {hint && (
        <p id={`${inputId}-hint`} className={styles.hintText}>
          {hint}
        </p>
      )}

      {error && (
        <p id={`${inputId}-error`} className={styles.errorText}>
          {error}
        </p>
      )}
    </div>
  );
}

const InputField = forwardRef(InputFieldComponent);
export default InputField;