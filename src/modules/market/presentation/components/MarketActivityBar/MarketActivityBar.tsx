import styles from './MarketActivityBar.module.css';

interface Props {
  activePanel: string | null;
  onToggle: (panel: string) => void;
}

export const MarketActivityBar = ({ activePanel, onToggle }: Props) => {
  return (
    <div className={styles.container}>
      {/* HISTORY TOGGLE */}
      <button 
        className={`${styles.iconBtn} ${activePanel === 'history' ? styles.active : ''}`}
        onClick={() => onToggle('history')}
        title="Trade History"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
        </svg>
      </button>
      
      {/* Placeholder: SETTINGS TOGGLE */}
      {/* <button className={styles.iconBtn} title="Settings">
        <svg width="24" height="24" ... />
      </button> */}
    </div>
  );
};