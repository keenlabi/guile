import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

// Assets
import NuvlonLogo from 'src/shared/presentation/assets/images/nuvlon-logo.svg?react';
import DemoAvatar from 'src/shared/presentation/assets/images/sarah-demo-user.png'; 
// --- Icons ---
import ExpandIcon from 'src/shared/presentation/assets/icons/expand.svg?react';
import CommunityIcon from 'src/shared/presentation/assets/icons/people.svg?react';
import JobsIcon from 'src/shared/presentation/assets/icons/briefcase.svg?react';
import BusinessIcon from 'src/shared/presentation/assets/icons/skyscraper.svg?react';
import MessagesIcon from 'src/shared/presentation/assets/icons/chat-bubbles.svg?react';
import SettingsIcon from 'src/shared/presentation/assets/icons/settings.svg?react';
import HelpIcon from 'src/shared/presentation/assets/icons/question-mark-circle.svg?react';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badgeCount?: number;
  isMainNav?: boolean;
}

function SidebarItem({ to, icon, label, badgeCount, isMainNav = false }: SidebarItemProps) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `${styles.navItem} ${isActive ? styles.active : ''}`
      }
    >
      <div className={styles.navItemContent}>
        <div className={styles.icon}>{icon}</div>
        <span className={[styles.label, isMainNav ? styles.mainNav : ""].join(" ")}>{label}</span>
      </div>
      {badgeCount !== undefined && badgeCount > 0 && (
        <span className={styles.badge}>{badgeCount}</span>
      )}
    </NavLink>
  );
}

export function Sidebar() {
  // TODO: Replace with real user data from AuthContext
  const user = {
    name: "Sarah Tanner",
    avatarUrl: DemoAvatar
  };

  return (
    <div className={styles.container}>
      {/* 1. Logo */}
      <div style={{ paddingLeft: '8px' }}>
        <NuvlonLogo width={110} />
      </div>

      {/* 2. Profile Snippet */}
      <div className={styles.userProfile}>
        <img src={user.avatarUrl} alt={user.name} className={styles.avatar} />
        
        <div className={styles.userInfo}>
          <span className={styles.userName}>{user.name}</span>
          <ExpandIcon />
        </div>
      </div>

      {/* 3. Main Navigation */}
      <nav className={styles.nav}>
        <SidebarItem 
          to="/communities" 
          label="Communities" 
          icon={<CommunityIcon />} 
          badgeCount={10}
          isMainNav={true}
        />

        <SidebarItem 
          to="/jobs" 
          label="Jobs" 
          icon={<JobsIcon />} 
          isMainNav={true}
        />

        <SidebarItem 
          to="/businesses" 
          label="Businesses" 
          icon={<BusinessIcon />} 
          badgeCount={10} 
          isMainNav={true}
        />

        <SidebarItem 
          to="/messages" 
          label="Messages" 
          icon={<MessagesIcon />} 
          isMainNav={true}
        />
      </nav>

      <div style={{ flex: 1 }} />

      {/* 4. Bottom Navigation */}
      <nav className={styles.nav}>
        <SidebarItem 
          to="/settings" 
          label="Settings" 
          icon={<SettingsIcon />} 
        />

        <SidebarItem 
          to="/help" 
          label="Help" 
          icon={<HelpIcon />} 
        />
      </nav>
    </div>
  );
}