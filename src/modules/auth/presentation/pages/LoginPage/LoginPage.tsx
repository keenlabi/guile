import styles from './LoginPage.module.css';
import { LoginForm } from '../../components/LoginForm/LoginForm';
import NuvlonLogo from 'src/shared/presentation/assets/images/nuvlon-logo.svg?react';

export function LoginPage() {
  return (
    <div className={styles.pageContainer}>
      <nav className={styles.navbar}>
        <div className={styles.logoContainer}>
          <NuvlonLogo />
        </div>
      </nav>

      <main className={styles.mainContent}>
        <LoginForm />
      </main>
    </div>
  );
}