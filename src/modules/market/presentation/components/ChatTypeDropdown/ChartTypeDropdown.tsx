import { useState, useRef, useEffect } from 'react';
import styles from './ChartTypeDropdown.module.css';
import ArrowDown from "src/shared/presentation/assets/icons/arrow-bottom.svg?react";

export type ChartStyleType = 'candle' | 'bar' | 'hollow' | 'line' | 'area';

interface Props {
  currentType: ChartStyleType;
  onChange: (type: ChartStyleType) => void;
}

const OPTIONS: { label: string; value: ChartStyleType; icon: string }[] = [
  { label: 'Bars', value: 'bar', icon: 'M4 4h2v16H4V4zm6 5h2v11h-2V9zm6-3h2v14h-2V6z' }, // Mock bar icon
  { label: 'Candles', value: 'candle', icon: 'M5 8h4v12H5V8zm1-5v5h2V3H6zm8 2h4v15h-4V5zm1-3v3h2V2h-2z' },
  { label: 'Hollow Candles', value: 'hollow', icon: 'M5 8h4v12H5V8zm1-5v5h2V3H6zm8 2h4v15h-4V5zm1-3v3h2V2h-2z' },
  { label: 'Line', value: 'line', icon: 'M3 15l6-6 4 4 8-8v2l-8 8-4-4-6 6z' },
  { label: 'Area', value: 'area', icon: 'M3 15l6-6 4 4 8-8v14H3V15z' },
];

export const ChartTypeDropdown = ({ currentType, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = OPTIONS.find(o => o.value === currentType);

  return (
    <div className={styles.container} ref={dropdownRef}>
      {/* The Trigger Button */}
      <button 
        className={`${styles.trigger} ${isOpen ? styles.active : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        title="Chart Style"
      >
        {/* Render a simplified SVG icon based on type */}
        <svg className={styles.selectedIcon} viewBox="0 0 24 24" fill="currentColor">
          <path d={selectedOption?.icon} />
        </svg>
        <ArrowDown className={styles.arrow} />
      </button>

      {/* The Dropdown Menu */}
      {isOpen && (
        <div className={styles.menu}>
          {OPTIONS.map((option) => (
            <div 
              key={option.value}
              className={`${styles.item} ${currentType === option.value ? styles.selected : ''}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className={styles.icon}>
                <path d={option.icon} />
              </svg>
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};