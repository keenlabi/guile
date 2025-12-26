import React, { forwardRef } from 'react';
import styles from './DropdownField.module.css';

// Simple interface for options
export interface DropdownOption {
  label: string;
  value: string | number;
}

export interface DropdownFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: DropdownOption[];
  error?: string;
  containerClassName?: string;
  placeholder?: string;
}

function DropdownFieldComponent({
  label,
  options,
  error,
  containerClassName,
  placeholder = "Select an option",
  id,
  className,
  ...props
}: DropdownFieldProps, ref: React.Ref<HTMLSelectElement>) {
  
  // Generate a fallback ID if one isn't provided
  const selectId = id || label.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className={`${styles.container} ${containerClassName || ''}`}>
      <label htmlFor={selectId} className={styles.label}>
        {label}
      </label>

      <div className={`
        ${styles.selectWrapper} 
        ${error ? styles.wrapperError : ''} 
        ${props.disabled ? styles.wrapperDisabled : ''}
      `}>
        <select
          ref={ref}
          id={selectId}
          className={[styles.select, className].join(" ")}
          aria-invalid={!!error}
          defaultValue="" 
          required
          {...props}
        >
          {/* Placeholder Option */}
          <option value={""} disabled hidden>
            {placeholder}
          </option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom Chevron Icon (SVG) */}
        <div className={styles.chevron}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {error && (
        <p id={`${selectId}-error`} className={styles.errorText}>
          {error}
        </p>
      )}
    </div>
  );
}

const DropdownField = forwardRef(DropdownFieldComponent);
export default DropdownField;