import styles from "./AppHeader.module.css";

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
}: AppHeaderProps) {
  
  return (
    <header className={styles.container}>
      {/* 1. Page Title */}
      <h1 className={styles.title}>{title}</h1>
    </header>
  );
}