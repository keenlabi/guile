import styles from './Footer.module.css';
import { Zap } from 'lucide-react';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Brand Section */}
                <div className={styles.logoSection}>
                    <div className={styles.logo}>
                        <Zap size={24} fill="#0ecb81" stroke="none" />
                        LUMEX
                    </div>
                    <p className={styles.description}>
                        Trade with zero latency on the world's fastest decentralized exchange. 
                        Secure, transparent, and built for professionals.
                    </p>
                </div>
                
                {/* Bottom Bar */}
                <div className={styles.bottomBar}>
                    <span className={styles.copyright}>
                        © 2026 Lumex. All rights reserved.
                    </span>
                    
                    <div className={styles.legalLinks}>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Cookie Preferences</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}