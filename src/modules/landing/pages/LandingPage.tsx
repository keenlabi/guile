import styles from './LandingPage.module.css';
import { HeroSection } from '../components/Hero/Hero';
import Navbar from '../components/NavBar/NavBar';
import SocialProof from '../components/SocialProof/SocialProof';
import Features from '../components/Features/Features';
import Footer from '../components/Footer/Footer';

export const LandingPage = () => {
  return (
    <div className={styles.container}>
      {/* Global Background Effect */}
      <div className={styles.bgGlow} />

      <Navbar />
      <HeroSection />
      {/* Moved SocialProof (Stats) under Hero as requested in design */}
      <SocialProof />
      <Features />
      <Footer />
    </div>
  );
};

export default LandingPage;