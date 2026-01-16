import { ArrowRight } from "lucide-react";
import styles from "./Features.module.css";
import FuturesTradingIllustration from "src/shared/presentation/assets/images/futures-trading.png";
import SpotMarketIllustration from "src/shared/presentation/assets/images/spot-market.png";
import TradingBotșIllustration from "src/shared/presentation/assets/images/trading-bots.png";
import LendingProtocolIllustration from "src/shared/presentation/assets/images/lending-protocol.png";

export default function Features() {
  const features = [
    {
      title: "Futures Trading",
      desc: "Trade crypto derivatives with up to 100x leverage on the fastest exchange.",
      stat: "$1.76B",
      statLabel: "24H Volume",
      illustration: FuturesTradingIllustration
    },
    {
      title: "Spot Markets",
      desc: "Trade BTC, ETH and over 462 crypto pairs on our lightning fast engine.",
      stat: "642",
      statLabel: "Spot Pairs",
      illustration: SpotMarketIllustration
    },
    {
      title: "Trading Bots",
      desc: "Customizable trading systems that empower users to execute automated strategies.",
      stat: "20,556",
      statLabel: "Active Bots",
      illustration: TradingBotșIllustration
    },
    {
      title: "Lending Protocol",
      desc: "One-click instant borrowing. Borrow with low rates and no extra fees.",
      stat: "0.84%",
      statLabel: "Supply APY",
      illustration: LendingProtocolIllustration
    }
  ];

  return (
    <div className={styles.featuresSection}>
      <div className={styles.maxWidthWrapper}>
        <div className={styles.featuresHeader}>
          <h2 className={styles.featuresTitle}>Trade Smart, Earn More</h2>
          <p className={styles.subtitle} style={{ marginBottom: 0 }}>
            Explore our diverse range of products tailored for every type of trader.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((feat, idx) => (
            <div key={idx} className={styles.featureCard}>
                <div className={styles.featureHeading}>
                    <h3 className={styles.featureTitle}>{feat.title}</h3>
                    <p className={styles.featureDesc}>{feat.desc}</p>
                </div>

                <img 
                    src={feat.illustration}
                    className={styles.cardIconBg} 
                />
              
                <div className={styles.cardFooter}>
                    <div className={styles.metric}>
                        <div className={styles.statValue}>{feat.stat}</div>
                        <div className={styles.statLabel}>{feat.statLabel}</div>
                    </div>
                    <button className={styles.tradeLink}>
                        Trade Now <ArrowRight size={16} />
                    </button>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};