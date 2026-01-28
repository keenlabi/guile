import { useEffect, useState } from 'react';
import { adminRepository } from 'src/modules/admin/infrastructure/repositories/admin.repository';
import { AppHeader } from 'src/shared/presentation/components/AppHeader/AppHeader';
import type { KycRequest } from 'src/modules/user/domain/kyc.types';
import styles from './KycRequestsPage.module.css';
import { formatDateTime } from 'src/shared/utils/date.utils';
import { KycReviewModal } from '../../components/KycReviewModal/KycReviewModal';

export const KycRequestsPage = () => {
  const [requests, setRequests] = useState<KycRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<KycRequest | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await adminRepository.getPendingKyc();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className={styles.container}>
      <AppHeader title="KYC Verification Queue" showCreateButton={false} />
      
      <div className={styles.tableWrapper}>
        {loading ? (
          <div style={{ padding: '24px', color: '#848e9c' }}>Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className={styles.empty}>No pending verifications.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User</th>
                <th>Country</th>
                <th>Document</th>
                <th>Submitted</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#EAECEF' }}>{req.firstName} {req.lastName}</div>
                    <div style={{ fontSize: '12px', color: '#848e9c' }}>{req.user.email}</div>
                  </td>
                  <td>{req.country}</td>
                  <td>{req.documentType.replace('_', ' ')}</td>
                  <td style={{ fontFamily: 'monospace' }}>{formatDateTime(req.createdAt)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className={styles.actionBtn}
                      onClick={() => setSelectedRequest(req)}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedRequest && (
        <KycReviewModal 
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onSuccess={fetchRequests}
        />
      )}
    </div>
  );
};