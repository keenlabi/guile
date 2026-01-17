import { useAiMode } from 'src/modules/auth/presentation/hooks/useAiMode';
import styles from './AiModeWidget.module.css';

export const AiModeWidget = () => {
  const { isManaged, toggleAiMode, isLoading } = useAiMode();

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.header}>
          <span className={styles.icon}>🤖</span>
          <h3>AI Trading Assistant</h3>
        </div>
        <p className={styles.desc}>
          Hand over control to our AI system. Manual trading will be disabled while active.
        </p>
      </div>

      <label className={styles.switch}>
        <input 
          type="checkbox" 
          checked={isManaged}
          disabled={isLoading}
          onChange={(e) => toggleAiMode(e.target.checked)}
        />
        <span className={`${styles.slider} ${isLoading ? styles.loading : ''}`} />
      </label>
    </div>
  );
};