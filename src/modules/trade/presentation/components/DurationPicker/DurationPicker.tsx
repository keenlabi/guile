import { useState, useRef, useEffect } from 'react';
import styles from './DurationPicker.module.css';

interface Props {
  valueSeconds: number;
  onChange: (seconds: number) => void;
}

export const DurationPicker = ({ valueSeconds, onChange }: Props) => {
  const isTypingRef = useRef(false);

  // Local state
  const [h, setH] = useState('00');
  const [m, setM] = useState('00');
  const [s, setS] = useState('00');

  // 1. Sync from Props
  useEffect(() => {
    if (isTypingRef.current) return;
    const hours = Math.floor(valueSeconds / 3600);
    const mins = Math.floor((valueSeconds % 3600) / 60);
    const secs = valueSeconds % 60;
    setH(hours.toString().padStart(2, '0'));
    setM(mins.toString().padStart(2, '0'));
    setS(secs.toString().padStart(2, '0'));
  }, [valueSeconds]);

  // 2. Calculation Helper
  const calculateTotal = (hStr: string, mStr: string, sStr: string) => {
    const hours = parseInt(hStr || '0', 10);
    const mins = parseInt(mStr || '0', 10);
    const secs = parseInt(sStr || '0', 10);
    return (hours * 3600) + (mins * 60) + secs;
  };

  // 3. Typing Handler
  const handleChange = (type: 'h'|'m'|'s', val: string) => {
    isTypingRef.current = true;
    if (val.length > 2) val = val.slice(0, 2);

    if (type === 'h') setH(val);
    if (type === 'm') setM(val);
    if (type === 's') setS(val);

    const total = type === 'h' 
      ? calculateTotal(val, m, s)
      : type === 'm' 
        ? calculateTotal(h, val, s)
        : calculateTotal(h, m, val);
        
    onChange(total);
  };

  // 4. Blur Handler (Format & Validate)
  const handleBlur = (type: 'h'|'m'|'s') => {
    isTypingRef.current = false;
    let rawVal = type === 'h' ? h : type === 'm' ? m : s;
    let val = parseInt(rawVal || '0', 10);

    if (type === 'h' && val > 23) val = 23;
    if ((type === 'm' || type === 's') && val > 59) val = 59;

    const formatted = val.toString().padStart(2, '0');
    if (type === 'h') setH(formatted);
    if (type === 'm') setM(formatted);
    if (type === 's') setS(formatted);

    const total = type === 'h' 
      ? calculateTotal(formatted, m, s)
      : type === 'm' 
        ? calculateTotal(h, formatted, s)
        : calculateTotal(h, m, formatted);
        
    if (total < 5) {
        onChange(5);
        if (type === 's') setS('05');
    } else {
        onChange(total);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    isTypingRef.current = true;
    e.target.select();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') e.currentTarget.blur();
    if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault();
  };

  return (
    <div className={styles.container}>
      {/* <div className={styles.clockIcon}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </div> */}
      
      {/* <div className={styles.group}>
        <input 
          type="number" 
          value={h}
          onChange={(e) => handleChange('h', e.target.value)}
          onBlur={() => handleBlur('h')}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
        />
        <span className={styles.unit}>h</span>
      </div> */}
      
      {/* <div className={styles.group}>
        <div className={styles.separator}>:</div>
      </div> */}

      {/* <div className={styles.group}>
        <input 
          type="number"
          value={m}
          onChange={(e) => handleChange('m', e.target.value)}
          onBlur={() => handleBlur('m')}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
        />
        <span className={styles.unit}>m</span>
      </div> */}
      
      {/* <div className={styles.group}>
        <div className={styles.separator}>:</div>
      </div> */}

      <div className={styles.group}>
        <input 
          type="number"
          value={s}
          onChange={(e) => handleChange('s', e.target.value)}
          onBlur={() => handleBlur('s')}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
        />
        <span className={styles.unit}>secs</span>
      </div>
    </div>
  );
};