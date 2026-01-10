import { useState, useRef, useEffect } from 'react';
import styles from './TimeframeDropdown.module.css';
import ArrowDown from "src/shared/presentation/assets/icons/arrow-bottom.svg?react";

interface Props {
  currentTimeframe: string;
  onChange: (value: string) => void;
}

const TIMEFRAMES = [
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '30m', value: '30m' },
  { label: '1h', value: '1h' },
  { label: '4h', value: '4h' },
  { label: '1d', value: '1d' },
];

export const TimeframeDropdown = ({ currentTimeframe, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  const currentLabel = TIMEFRAMES.find(t => t.value === currentTimeframe)?.label || currentTimeframe;

  return (
    <div className={styles.container} ref={containerRef}>
      <button 
        className={`${styles.trigger} ${isOpen ? styles.active : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.activeDuration}>{currentLabel}</span>
        <ArrowDown />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.value}
              className={`${styles.item} ${currentTimeframe === tf.value ? styles.selected : ''}`}
              onClick={() => handleSelect(tf.value)}
            >
              {tf.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};