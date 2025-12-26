import styles from "./Registration.module.css";
import { RegistrationForm } from "../../components/RegistrationForm/RegistrationForm";
import NuvlonLogo from "src/shared/presentation/assets/images/nuvlon-logo.svg?react";

export function RegistrationPage() {
  return (
    <div className={styles.pageContainer}>
      <nav className={styles.navbar}>
        <div className={styles.logoContainer}>
          <NuvlonLogo />
        </div>
      </nav>

      <main className={styles.mainContent}>
        <RegistrationForm />
      </main>
    </div>
  );
}