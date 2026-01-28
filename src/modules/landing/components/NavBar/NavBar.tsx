import styles from "./NavBar.module.css";
import { Menu, X, Zap } from 'lucide-react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "src/shared/presentation/routes/routes";
import { useAuth } from "src/shared/presentation/hooks/useAuth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleNav = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.maxWidthWrapper}>
        <div className={styles.logo} onClick={() => navigate('/')}>
          <Zap size={24} fill="#0ecb81" stroke="none" />
          LUMEX
        </div>

        {/* Desktop Links */}
        <div className={styles.desktopMenu}>
          <a onClick={() => handleNav(ROUTES.MARKET)} href="#">Markets</a>
          <a href="#features">Features</a>
          <a href="#">Support</a>
        </div>

        {/* Auth Buttons */}
        <div className={styles.authButtons}>
          {!isAuthenticated ? (
            <>
              <button onClick={() => navigate(ROUTES.LOGIN)} className={styles.btnLogin}>
                Log In
              </button>
              <button onClick={() => navigate(ROUTES.SIGNUP)} className={styles.btnSignup}>
                Register
              </button>
            </>
          ) : (
             <button onClick={() => navigate(ROUTES.MARKET)} className={styles.btnSignup}>
                Dashboard
              </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className={styles.mobileToggle}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={styles.mobileMenu}>
          <a onClick={() => handleNav(ROUTES.MARKET)} className={styles.mobileLink}>Markets</a>
          <a href="#features" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Features</a>
          
          {!isAuthenticated ? (
            <>
                <button onClick={() => handleNav(ROUTES.LOGIN)} className={styles.mobileLink} style={{textAlign:'left', background:'none', border:'none'}}>Log In</button>
                <button onClick={() => handleNav(ROUTES.SIGNUP)} className={styles.btnMobileSignup}>Sign Up</button>
            </>
          ) : (
            <button onClick={() => handleNav(ROUTES.MARKET)} className={styles.btnMobileSignup}>Go to Dashboard</button>
          )}
        </div>
      )}
    </nav>
  );
};