import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { ROUTES } from '../../routes/routes';
import { useAuth } from '../../hooks/useAuth';
import { UserRoleHelper } from '../../helpers/user-role.helper';

// --- ICONS ---
import OverviewIcon from 'src/shared/presentation/assets/icons/expand.svg?react';
import MarketIcon from 'src/shared/presentation/assets/icons/market.svg?react'; 
import WalletIcon from 'src/shared/presentation/assets/icons/wallet.svg?react'; 
import authRepository from 'src/modules/auth/infrastructure/repositories/auth.repository';
import { useToast } from '../../hooks/useToast';

// Simple inline SVG for Logout to match your flat style
const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// --- HELPER COMPONENT ---
interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badgeCount?: number;
}

function SidebarItem({ to, icon, label, badgeCount }: SidebarItemProps) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `${styles.navItem} ${isActive ? styles.active : ''}`
      }
    >
      <div className={styles.navItemContent}>
        <div className={styles.icon}>{icon}</div>
        <span className={styles.label}>{label}</span>
      </div>
      {badgeCount !== undefined && badgeCount > 0 && (
        <span className={styles.badge}>{badgeCount}</span>
      )}
    </NavLink>
  );
}

// --- MAIN COMPONENT ---
export function Sidebar() {
  const { profile, setLogout } = useAuth(); // Assuming logout is exposed here
  const navigate = useNavigate();
  const isAdmin = profile ? UserRoleHelper.isAdmin(profile.role) : false;
  const { showError } = useToast();

  const handleLogout = async () => {
    try {
      await authRepository.logout()
      setLogout()
    } catch(error) {
      showError(error);
    }
    navigate('/login');
  };

  function handleProfileClick() {
    navigate(ROUTES.PROFILE);
  }

  return (
    <aside className={styles.container}>
      
      {/* 1. TOP SECTION (Logo + Navigation) */}
      <div className={styles.topSection}>
        <div className={styles.logoWrapper}>
          <h2 style={{ color: '#EAECEF', margin: 0, paddingLeft: '8px' }}>GUILE</h2>
        </div>

        <nav className={styles.nav}>
          {/* <SidebarItem 
            to={ROUTES.DASHBOARD} 
            label="Overview" 
            icon={<OverviewIcon />} 
          /> */}

          <SidebarItem 
            to={ROUTES.MARKET} 
            label="Market" 
            icon={<MarketIcon />} 
          />

          <SidebarItem 
            to={ROUTES.WALLET} 
            label="Wallet" 
            icon={<WalletIcon />} 
          />
        </nav>

        {/* Admin Navigation */}
        {isAdmin && (
          <nav className={styles.nav} style={{ marginTop: '24px' }}>
            <div className={styles.sectionLabel}>Admin</div>
            <SidebarItem 
              to={ROUTES.ADMIN_TRADERS} 
              label="Traders Directory" 
              icon={<OverviewIcon />} 
            />
            <SidebarItem 
              to={ROUTES.ADMIN_PREDICTION_LIST} 
              label="Predictions"
              icon={<OverviewIcon />} 
            />
            <SidebarItem 
              to={ROUTES.ADMIN_WITHDRAWALS} 
              label="Withdrawals"
              icon={<WalletIcon />} // Reusing WalletIcon for now
            />
          </nav>
        )}
      </div>

      {/* 2. BOTTOM SECTION (Settings + User + Logout) */}
      <div className={styles.bottomSection}>
        
        {/* Settings Link */}
        {/* <nav className={styles.nav}>
          <SidebarItem 
            to={ROUTES.SETTINGS} 
            label="Settings" 
            icon={<SettingsIcon />} 
          />
        </nav> */}

        <div className={styles.divider} />

        {/* User Profile Card */}
        <div className={styles.userProfile} onClick={handleProfileClick}>
          <div className={styles.avatar}>
            {profile?.email?.[0] || 'U'}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userEmail} title={profile?.email}>
              {profile?.email || 'User'}
            </span>
            <span className={styles.userStatus}>Verified</span>
          </div>
        </div>

        {/* Logout Button */}
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <div className={styles.navItemContent}>
            <div className={styles.icon}><LogoutIcon /></div>
            <span className={styles.label}>Log Out</span>
          </div>
        </button>
      </div>

    </aside>
  );
}