import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { ROUTES } from '../../routes/routes';

// Icons (Mapped to new features)
import OverviewIcon from 'src/shared/presentation/assets/icons/expand.svg?react';
import MarketIcon from 'src/shared/presentation/assets/icons/skyscraper.svg?react'; 
import TradeIcon from 'src/shared/presentation/assets/icons/people.svg?react';
import PortfolioIcon from 'src/shared/presentation/assets/icons/briefcase.svg?react';
import SettingsIcon from 'src/shared/presentation/assets/icons/settings.svg?react';
import { useAuth } from '../../hooks/useAuth';
import { UserRoleHelper } from '../../helpers/user-role.helper';

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

export function Sidebar() {
  const { profile } = useAuth();
  const isAdmin = UserRoleHelper.isAdmin(profile!.role);

  return (
    <div className={styles.container}>
      {/* 1. Logo */}
      <div className={styles.logoWrapper}>
        {/* <NuvlonLogo width={110} /> */}
        GUILE
      </div>

      {/* 2. Main Features */}
      <nav className={styles.nav}>
        <SidebarItem 
          to={ROUTES.DASHBOARD} 
          label="Overview" 
          icon={<OverviewIcon />} 
        />

        <SidebarItem 
          to={ROUTES.MARKET} 
          label="Market" 
          icon={<MarketIcon />} 
        />

        <SidebarItem 
          to={ROUTES.TRADE} 
          label="Trade" 
          icon={<TradeIcon />} 
        />

        <SidebarItem 
          to={ROUTES.PORTFOLIO} 
          label="Portfolio" 
          icon={<PortfolioIcon />} 
        />
      </nav>

      {/* 4. Admin Navigation (Conditional) */}
      {isAdmin && (
        <>
          <div className={styles.divider} /> {/* Optional CSS divider */}
          <div className={styles.sectionLabel}>Admin</div>
          <nav className={styles.nav}>
            <SidebarItem 
              to={ROUTES.ADMIN_TRADERS} 
              label="Traders Directory" 
              icon={<OverviewIcon />} 
            />
          </nav>
        </>
      )}

      <div style={{ flex: 1 }} />

      {/* 3. Bottom Actions */}
      <nav className={styles.nav}>
        <SidebarItem 
          to={ROUTES.SETTINGS} 
          label="Settings" 
          icon={<SettingsIcon />} 
        />
      </nav>
    </div>
  );
}