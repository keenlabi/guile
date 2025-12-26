import { Outlet } from 'react-router-dom';
import styles from './AppLayout.module.css';
import { Sidebar } from '../components/SideBar/SideBar';

export function AppLayout() {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebarWrapper}>
        <Sidebar />
      </aside>
      
      <main className={styles.contentWrapper}>
        <Outlet />
      </main>
    </div>
  );
}