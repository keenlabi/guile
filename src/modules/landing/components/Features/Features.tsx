import { BarChart2, ShieldCheck, Globe, Clock, Layers, Zap } from "lucide-react";
import styles from "./Features.module.css";

export default function Features() {
  const features = [
    {
      title: "Advanced Charting",
      desc: "Professional-grade tools with real-time data from Binance. Analyze trends with 100% accuracy.",
      icon: <BarChart2 size={24} />
    },
    {
      title: "Bank-Grade Security",
      desc: "Your funds are protected by industry-leading encryption and cold storage protocols.",
      icon: <ShieldCheck size={24} />
    },
    {
      title: "Global Liquidity",
      desc: "Access deep liquidity pools ensuring your orders are filled instantly at the best price.",
      icon: <Globe size={24} />
    },
    {
      title: "Instant Withdrawals",
      desc: "Get your earnings fast. Automated processing system ensures your funds reach you in minutes.",
      icon: <Clock size={24} />
    },
    {
      title: "Portfolio Management",
      desc: "Track your assets across multiple wallets and exchanges in one unified dashboard.",
      icon: <Layers size={24} />
    },
    {
      title: "Lightning Execution",
      desc: "Built on a high-frequency matching engine capable of handling 100,000 orders per second.",
      icon: <Zap size={24} />
    }
  ];

  return (
    <section id="features" className={styles.featuresSection}>
      <div className={styles.maxWidthWrapper}>
        <div className={styles.featuresGrid}>
          {features.map((feat, idx) => (
            <div key={idx} className={styles.featureCard}>
                <div className={styles.iconWrapper}>{feat.icon}</div>
                <h3 className={styles.featureTitle}>{feat.title}</h3>
                <p className={styles.featureDesc}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};