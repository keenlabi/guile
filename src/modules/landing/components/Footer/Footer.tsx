import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`${styles.maxWidthWrapper} ${styles.footerGrid}`}>
                <div style={{ gridColumn: 'span 2' }}>
                    <div className={styles.logo} style={{ marginBottom: '1.5rem' }}>CRYPTO<span>EX</span></div>
                    <p style={{ maxWidth: '300px', marginBottom: '1.5rem' }}>The world's most trustworthy and fastest cryptocurrency exchange platform.</p>
                </div>
                
                <div className={styles.footerCol}>
                    <h4>Products</h4>
                    <ul>
                        <li><a href="#">Spot Trading</a></li>
                        <li><a href="#">Futures Trading</a></li>
                        <li><a href="#">Trading Bots</a></li>
                        <li><a href="#">Earn</a></li>
                    </ul>
                </div>

                <div className={styles.footerCol}>
                    <h4>Support</h4>
                    <ul>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Fees & Conditions</a></li>
                        <li><a href="#">API Documentation</a></li>
                    </ul>
                </div>

                <div className={styles.footerCol}>
                    <h4>Company</h4>
                    <ul>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Security</a></li>
                    </ul>
                </div>
            </div>
            <div className={styles.maxWidthWrapper}>
                <div className={styles.copyright}>
                    © 2026 CryptoEx. All rights reserved.
                </div>
            </div>
        </footer>
    )
}