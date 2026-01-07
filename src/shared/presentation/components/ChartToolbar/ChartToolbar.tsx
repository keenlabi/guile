import { useState } from 'react';
import styles from './ChartToolbar.module.css';
import { ChartTypeDropdown, type ChartStyleType } from 'src/modules/market/presentation/components/ChatTypeDropdown/ChartTypeDropdown';

interface Props {
  onTypeChange: (type: ChartStyleType) => void;
  onScreenshot: () => void;
  onFullscreen: () => void;
  onScaleChange: (mode: 'log' | 'normal' | 'auto') => void;
  onTimeframeChange: (interval: string) => void;
}

const TIMEFRAMES = [
  { label: '15m', value: '15m' },
  { label: '1H', value: '1h' },
  { label: '4H', value: '4h' },
  { label: '1D', value: '1d' },
];

export const ChartToolbar = ({ 
  onTypeChange, 
  onScreenshot, 
  onFullscreen, 
  onScaleChange,
  onTimeframeChange
}: Props) => {
  const [currentType, setCurrentType] = useState<ChartStyleType>('area');
  const [activeTimeframe, setActiveTimeframe] = useState('1h');
  const [isLog, setIsLog] = useState(false);
  const [isAuto, setIsAuto] = useState(true);

  const handleTypeChange = (type: ChartStyleType) => {
    setCurrentType(type);
    onTypeChange(type);
  };

  const handleTimeframeClick = (tf: string) => {
    setActiveTimeframe(tf);
    onTimeframeChange(tf);
  };

  const toggleLog = () => {
    const newLog = !isLog;
    setIsLog(newLog);
    onScaleChange(newLog ? 'log' : 'normal');
  };

  const toggleAuto = () => {
    setIsAuto(true); // Usually Auto is a one-time trigger or 'always on' state
    onScaleChange('auto');
  };

  return (
    <div className={styles.toolbar}>
      
      {/* --- LEFT GROUP: Main Chart Controls --- */}
      <div className={styles.group}>
        {/* Chart Type Dropdown */}
        <ChartTypeDropdown currentType={currentType} onChange={handleTypeChange} />
        
        <div className={styles.dividerSmall} />
        
        {/* Dynamic Timeframe Buttons */}
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf.value}
            className={`${styles.textBtn} ${activeTimeframe === tf.value ? styles.activeText : ''}`}
            onClick={() => handleTimeframeClick(tf.value)}
          >
            {tf.label}
          </button>
        ))}
      </div>

      {/* --- SPACER: Pushes everything else to the right --- */}
      <div className={styles.spacer} />

      {/* --- RIGHT GROUP: View Settings & Tools --- */}
      <div className={styles.group}>
        
        {/* Scale Toggles */}
        <button 
          className={`${styles.textBtn} ${isLog ? styles.activeText : ''}`} 
          onClick={toggleLog}
          title="Logarithmic Scale"
        >
          log
        </button>
        <button 
          className={`${styles.textBtn} ${isAuto ? styles.activeText : ''}`} 
          onClick={toggleAuto}
          title="Auto Scale"
        >
          auto
        </button>

        <div className={styles.dividerSmall} />

        {/* Action Icons */}
        <button className={styles.iconBtn} onClick={onFullscreen} title="Fullscreen">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
        </button>

        <button className={styles.iconBtn} onClick={onScreenshot} title="Take Screenshot">
           <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" /><path fillRule="evenodd" clipRule="evenodd" d="M9 2l-1.83 2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2.17L15 2H9zM5 18V6h14v12H5z" /></svg>
        </button>
{/* 
        <button className={styles.iconBtn} title="Settings">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.488.488 0 00-.59.22L2.77 8.87a.49.49 0 00.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 00-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
        </button> */}
      </div>
    </div>
  );
};