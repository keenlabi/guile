import { AppHeader } from 'src/shared/presentation/components/AppHeader/AppHeader';
// import { WalletPage } from './WalletPage';
// import styles from './OverviewPage.module.css';

export const OverviewPage = () => {
  return (
    <>
      <AppHeader 
        title="Overview" 
        showCreateButton={false} 
        searchPlaceholder="Search assets..." 
      />
      <div style={{ padding: '0 3.2rem' }}>
        {/* <WalletPage />  */}
      </div>
    </>
  );
};