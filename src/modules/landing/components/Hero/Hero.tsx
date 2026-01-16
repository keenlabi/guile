import styles from "./Hero.module.css";
import { Globe, ShieldCheck } from 'lucide-react';
import CoinBasket from "src/shared/presentation/assets/images/coin-basket.png"

export function HeroSection() {
  return (
    <div className={styles.heroSection}>
      {/* Background Gradients */}
      <div className={`${styles.heroGlow} ${styles.glowGreen}`} />
      <div className={`${styles.heroGlow} ${styles.glowBlue}`} />

      <div className={`${styles.maxWidthWrapper} ${styles.heroContent}`}>
        {/* Left: Text */}
        <div className={styles.heroText}>
          <h1 className={styles.title}>
            Next Gen <br />
            Trading Platform
          </h1>
          {/* UPDATED COPY: Focus on Trade/Invest, removed "Buy" */}
          <p className={styles.subtitle}>
            Trade, invest, and speculate on cryptocurrency prices with the fastest execution engine and real-time market data.
          </p>

          <div className={styles.heroForm}>
            <input type="email" placeholder="Email Address" className={styles.emailInput} />
            <button className={styles.ctaButton}>Join Now</button>
          </div>
          
          <div className={styles.trustBadges}>
             <div className={styles.badge}><ShieldCheck size={18} color="#22c55e" /> Secure Platform</div>
             <div className={styles.badge}><Globe size={18} color="#22c55e" /> 24/7 Markets</div>
          </div>
        </div>

        {/* Right: Visual */}
        <div className={styles.heroVisualWrapper}>
            <img src={CoinBasket} className={styles.heroVisual} />
        </div>
      </div>
    </div>
  );
};