import { useGoogleCallback } from '../../../../../shared/presentation/hooks/useGoogleCallback';
import styles from "./callback.module.css";
import { Link } from 'react-router-dom';

export function CallbackPage() {
  const { error, isLoading } = useGoogleCallback();

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.spinner}></div>
        <p className={styles.message}>
          Securely authenticating... Please wait.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.errorContainer}>
        <h1 className={styles.errorTitle}>Authentication Failed</h1>
        <p className={styles.errorMessage}>{error}</p>
        <Link to="/login" className={styles.link}>
          Go back to Login
        </Link>
      </div>
    </div>
  );
}