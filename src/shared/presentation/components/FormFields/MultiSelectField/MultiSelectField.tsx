import React, { useState, useEffect, useRef, forwardRef } from 'react';
import styles from './MultiSelectField.module.css';

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectFieldProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string;
  options: MultiSelectOption[];
  value?: string[];
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  error?: string;
  placeholder?: string;
  containerClassName?: string;
}

const MultiSelectField = forwardRef<HTMLSelectElement, MultiSelectFieldProps>((props, ref) => {
  const {
    label,
    options,
    value: controlledValue,
    onChange,
    onBlur,
    name,
    error,
    placeholder = "Select options",
    containerClassName,
    // className,
    // style,
    ...rest
  } = props;

  // Initialize state
  const [internalValue, setInternalValue] = useState<string[]>(
    Array.isArray(controlledValue) ? controlledValue : []
  );
  const [isOpen, setIsOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const localSelectRef = useRef<HTMLSelectElement | null>(null);
  const isUserChange = useRef(false);

  // 1. SYNC STATE
  useEffect(() => {
    if (controlledValue && JSON.stringify(controlledValue) !== JSON.stringify(internalValue)) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  // 2. TRIGGER CHANGE EVENT
  useEffect(() => {
    if (isUserChange.current && localSelectRef.current && onChange) {
      const event = {
        target: localSelectRef.current,
        currentTarget: localSelectRef.current,
        type: 'change',
        bubbles: true,
      } as unknown as React.ChangeEvent<HTMLSelectElement>;

      onChange(event);
      isUserChange.current = false;
    }
  }, [internalValue, onChange]);

  // 3. CLICK OUTSIDE (Fix applied here)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        
        // FIX: Pass the REAL select element to onBlur so RHF reads the value correctly
        if (onBlur && localSelectRef.current) {
          const blurEvent = {
             target: localSelectRef.current,
             currentTarget: localSelectRef.current,
             type: 'blur',
             bubbles: true
          } as unknown as React.FocusEvent<HTMLSelectElement>;
          
          onBlur(blurEvent);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onBlur, name]);

  const handleToggleOption = (optionValue: string) => {
    const isSelected = internalValue.includes(optionValue);
    const newValue = isSelected
      ? internalValue.filter(v => v !== optionValue)
      : [...internalValue, optionValue];

    setInternalValue(newValue);
    isUserChange.current = true;
  };

  const removeOption = (e: React.MouseEvent, optionValue: string) => {
    e.stopPropagation();
    setInternalValue(internalValue.filter(v => v !== optionValue));
    isUserChange.current = true;
  };

  return (
    <div className={`${styles.container} ${containerClassName || ''}`} ref={containerRef}>
      <label className={styles.label}>{label}</label>

      {/* HIDDEN SELECT - Added value prop back to let React control DOM */}
      <select 
        multiple 
        name={name}
        ref={(e) => {
          localSelectRef.current = e;
          if (typeof ref === 'function') ref(e);
          else if (ref) ref.current = e;
        }}
        value={internalValue} // React will now automatically sync 'selected' attributes
        onChange={() => {}} 
        style={{ 
          height: 0, width: 0, opacity: 0, position: 'absolute', pointerEvents: 'none', bottom: 0, left: 0
        }}
        {...rest}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* CUSTOM UI */}
      <div 
        className={`${styles.wrapper} ${isOpen ? styles.open : ''} ${error ? styles.wrapperError : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
      >
        {internalValue.length === 0 ? (
          <span className={styles.placeholder}>{placeholder}</span>
        ) : (
          internalValue.map(val => {
            const option = options.find(o => o.value === val);
            return (
              <span key={val} className={styles.chip}>
                {option ? option.label : val}
                <button 
                  type="button" 
                  className={styles.removeBtn}
                  onClick={(e) => removeOption(e, val)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </span>
            );
          })
        )}
        <div className={styles.chevron}>
           <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {options.map((option) => {
            const isSelected = internalValue.includes(option.value);
            return (
              <div 
                key={option.value} 
                className={`${styles.option} ${isSelected ? styles.selected : ''}`}
                onClick={() => handleToggleOption(option.value)}
              >
                <div className={styles.checkbox}>
                  {isSelected && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className={styles.optionText}>{option.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
});

export default MultiSelectField;