import styles from "./NavBar.module.css";
import { Menu, X } from 'lucide-react';
import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "src/shared/presentation/routes/routes";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={`${styles.maxWidthWrapper} ${styles.navContent}`}>
        <div className={styles.logo}>
          CRYPTO<span>EX</span>
        </div>

        {/* Desktop Links */}
        <div className={styles.desktopMenu}>
          {['Markets', 'Futures', 'Spot', 'Earn', 'Learn'].map((item) => (
            <a key={item} href="#">{item}</a>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className={styles.authButtons}>
          <Link to={ROUTES.LOGIN} className={styles.btnLogin}>Log In</Link>
          <Link to={ROUTES.SIGNUP} className={styles.btnSignup}>Sign Up</Link>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className={styles.mobileToggle}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div style={{ position: 'absolute', top: '64px', width: '100%', zIndex: 40 }}>
          <div className={styles.mobileMenu}>
            {['Markets', 'Futures', 'Spot', 'Earn'].map((item) => (
              <a key={item} href="#" className={styles.mobileLink}>{item}</a>
            ))}
            <button className={styles.btnMobileSignup}>Sign Up</button>
          </div>
        </div>
      )}
    </nav>
  );
};