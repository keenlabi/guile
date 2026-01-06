import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminRepository, type TraderSummary } from 'src/modules/admin/infrastructure/repositories/admin.repository';
import { AppHeader } from 'src/shared/presentation/components/AppHeader/AppHeader';
import styles from './TradersListPage.module.css';

export const TradersListPage = () => {
  const [traders, setTraders] = useState<TraderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    adminRepository.getTraders()
    .then(setTraders)
    .finally(() => setLoading(false));
  }, []);

  // const formatName = (trader: TraderSummary) => {
  //   if (!trader.firstName && !trader.lastName) return "Unnamed Trader";
  //   return `${trader.firstName ?? ''} ${trader.lastName ?? ''}`.trim();
  // };

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
          <div style={{ padding: '2rem' }}>Loading traders...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                {/* <th>Name</th> */}
                <th>Email</th>
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
                  {/* <td className={styles.traderName}>
                    {formatName(trader)}
                  </td> */}
                  <td className={styles.traderEmail}>{trader.email}</td>
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