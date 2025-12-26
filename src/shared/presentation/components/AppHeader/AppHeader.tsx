import Button from '../Button/Button';
import SearchField from '../FormFields/SearchField/SearchField';
import styles from "./AppHeader.module.css";
import NotificationIcon from 'src/shared/presentation/assets/icons/notification.svg?react';

interface AppHeaderProps {
  title: string;
  onSearch?: (query: string) => void;
  onCreateClick?: () => void;
  searchPlaceholder?: string;
  showCreateButton?: boolean;
  createButtonLabel?: string;
}

export function AppHeader({ 
  title, 
  onSearch, 
  onCreateClick, 
  searchPlaceholder = "Search Communities",
  showCreateButton = true,
  createButtonLabel = "Create your Community"
}: AppHeaderProps) {
  
  return (
    <header className={styles.container}>
      {/* 1. Page Title */}
      <h1 className={styles.title}>{title}</h1>

      {/* 2. Actions Area */}
      <div className={styles.actions}>
        
        {/* Search Field */}
        <SearchField
          className={styles.searchField}
          placeholder={searchPlaceholder}
          onChange={(e) => onSearch?.(e.target.value)}
        />

        {/* Notification Icon */}
        <button className={styles.iconBtn} aria-label="Notifications">
          <NotificationIcon />
          <span className={styles.notificationBadge} />
        </button>

        {/* Primary Action Button */}
        {showCreateButton && (
          <Button
            variant="primary" 
            className={styles.createBtn}
            onClick={onCreateClick}
          >
            {createButtonLabel}
          </Button>
        )}
      </div>
    </header>
  );
}