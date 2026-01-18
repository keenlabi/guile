import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminRepository, type TraderSummary } from 'src/modules/admin/infrastructure/repositories/admin.repository';
import { AppHeader } from 'src/shared/presentation/components/AppHeader/AppHeader';
import styles from './TradersListPage.module.css';

// Simple Icon for AI Mode
const AiIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8" y2="16" />
    <line x1="16" y1="16" x2="16" y2="16" />
  </svg>
);

export const TradersListPage = () => {
  const [traders, setTraders] = useState<TraderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    adminRepository.getTraders()
    .then(setTraders)
    .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.container}>
      <AppHeader title="Traders Directory" showCreateButton={false} />
      
      <div className={styles.tableWrapper}>
        {loading ? (
          <div style={{ padding: '2rem', color: '#848e9c' }}>Loading traders...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Mode</th> {/* NEW COLUMN */}
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {traders.map(trader => (
                <tr 
                  key={trader.userId} 
                  onClick={() => navigate(`/admin/traders/${trader.userId}/wallets`)}
                >
                  <td className={styles.traderEmail}>
                    {trader.email}
                  </td>
                  
                  {/* AI MODE COLUMN */}
                  <td>
                    {trader.isManaged ? (
                      <span className={styles.aiBadge}>
                        <AiIcon /> AI Active
                      </span>
                    ) : (
                      <span className={styles.manualBadge}>Manual</span>
                    )}
                  </td>

                  <td>
                    <span className={`${styles.statusBadge} ${styles[trader.status]}`}>
                      {trader.status}
                    </span>
                  </td>
                  <td className={styles.dateText}>
                    {formatDate(trader.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};