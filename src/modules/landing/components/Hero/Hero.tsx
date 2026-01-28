import styles from "./Hero.module.css";
import { ArrowRight } from 'lucide-react';
import CoinBasket from "src/shared/presentation/assets/images/coin-basket.png"
import { useNavigate } from "react-router-dom";
import { ROUTES } from "src/shared/presentation/routes/routes";
import { useAuth } from "src/shared/presentation/hooks/useAuth";

export function HeroSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handlePrimaryClick = () => {
    if (isAuthenticated) {
      navigate(ROUTES.MARKET);
    } else {
      navigate(ROUTES.SIGNUP);
    }
  };

  return (
    <div className={styles.heroSection}>
      <div className={styles.maxWidthWrapper}>
        
        {/* Left: Text */}
        <div className={styles.heroText}>
          <div className={styles.badge}>v2.0 Now Live</div>
          
          <h1 className={styles.title}>
            Trade the financial market with <br />
            <span>Zero Latency.</span>
          </h1>
          
          <p className={styles.subtitle}>
            Experience the world's fastest trading engine. Buy, sell, and trade cryptocurrencies with institutional-grade security and deep liquidity.
          </p>

          <div className={styles.ctaGroup}>
            <button onClick={handlePrimaryClick} className={styles.btnPrimary}>
              {isAuthenticated ? 'Go to Dashboard' : 'Start Trading'} <ArrowRight size={20} />
            </button>
            <button className={styles.btnSecondary} onClick={() => navigate(ROUTES.MARKET)}>
              View Live Markets
            </button>
          </div>
        </div>

        {/* Right: Visual */}
        <div className={styles.heroVisualWrapper}>
            <img src={CoinBasket} className={styles.heroVisual} alt="Crypto Basket" />
        </div>
      </div>
    </div>
  );
};