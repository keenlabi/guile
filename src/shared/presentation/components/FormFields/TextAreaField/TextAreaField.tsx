import React, { forwardRef } from 'react';
import styles from './TextAreaField.module.css';

export interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string | null;
  hint?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  containerClassName?: string;
  wrapperClassName?: string;
  width?: string;
}

function TextAreaFieldComponent({ 
    label, 
    error, 
    hint,
    prefixIcon, 
    suffixIcon, 
    className, 
    containerClassName, 
    wrapperClassName,
    width,
    id,
    placeholder,
    ...props 
  }: TextAreaFieldProps, ref: React.Ref<HTMLTextAreaElement>) {
  
  const inputId = id || props.name || label?.replace(/\s+/g, '-').toLowerCase() || placeholder?.replace(/\s+/g, '-').toLowerCase();

  return (
    <div 
      className={`${styles.container} ${containerClassName || ''}`} 
      style={{ width }}
    >
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      
      <div className={`
        ${styles.textareaWrapper} 
        ${wrapperClassName || ''}
        ${error ? styles.wrapperError : ''} 
        ${props.disabled || props.readOnly ? styles.wrapperDisabled : ''}
      `}>
        {prefixIcon && <span className={styles.prefixIcon}>{prefixIcon}</span>}
        
        <textarea
          ref={ref}
          id={inputId}
          className={`
            ${styles.textarea} 
            ${className || ''}
            ${prefixIcon ? styles.hasPrefix : ''}
            ${suffixIcon ? styles.hasSuffix : ''}
          `}
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

const TextAreaField = forwardRef(TextAreaFieldComponent);
export default TextAreaField;