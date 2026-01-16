import styles from './LandingPage.module.css';
import { HeroSection } from '../components/Hero/Hero';
import Navbar from '../components/NavBar/NavBar';
import SocialProof from '../components/SocialProof/SocialProof';
import Features from '../components/Features/Features';
import Footer from '../components/Footer/Footer';

// --- MAIN PAGE LAYOUT ---
export const LandingPage = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      <HeroSection />
      {/* <MarketTicker /> */}
      <SocialProof />
      <Features />
      <Footer />
    </div>
  );
};

export default LandingPage;