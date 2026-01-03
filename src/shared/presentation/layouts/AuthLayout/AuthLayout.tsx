import type { ReactNode } from 'react';
import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className={styles.container}>
      {/* LEFT: Black Banner */}
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <h1 className={styles.bannerTitle}>{title || "$15,000 Welcome Rewards"}</h1>
          <p className={styles.bannerText}>
            {subtitle || "Grab up to $15,000 Welcome Rewards to kickstart your crypto investing journey!"}
          </p>
          {/* Placeholder for the gift box image */}
          {/* <img 
            src="https://placehold.co/400x300/0f1216/00d563?text=Gift+Box+Graphic" 
            alt="Welcome Rewards" 
            className={styles.giftImage}
          /> */}
        </div>
      </div>

      {/* RIGHT: Form Area */}
      <div className={styles.formSide}>
        <div className={styles.formWrapper}>
          {children}
        </div>
      </div>
    </div>
  );
};