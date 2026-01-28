import { useState } from 'react';
import styles from './KycReviewModal.module.css';
import type { KycRequest } from 'src/modules/user/domain/kyc.types';
import { adminRepository } from 'src/modules/admin/infrastructure/repositories/admin.repository';
import { useToast } from 'src/shared/presentation/hooks/useToast';

interface Props {
  request: KycRequest;
  onClose: () => void;
  onSuccess: () => void;
}

export const KycReviewModal = ({ request, onClose, onSuccess }: Props) => {
  const { showSuccess, showError } = useToast();
  const [processing, setProcessing] = useState(false);

  const handleAction = async (action: 'APPROVE' | 'REJECT') => {
    let reason = undefined;
    if (action === 'REJECT') {
      const input = prompt("Enter rejection reason (optional):");
      if (input === null) return; // Cancelled
      reason = input;
    }

    setProcessing(true);
    try {
      await adminRepository.reviewKyc(request.id, action, reason);
      showSuccess(`KYC ${action === 'APPROVE' ? 'Approved' : 'Rejected'}`);
      onSuccess();
      onClose();
    } catch (e: any) {
      showError(e.message || "Action failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Review KYC Request</h2>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        <div className={styles.content}>
          {/* User Details */}
          <div className={styles.infoPanel}>
            <div className={styles.group}>
              <span className={styles.label}>Full Name</span>
              <span className={styles.value}>{request.firstName} {request.lastName}</span>
            </div>
            
            <div className={styles.group}>
              <span className={styles.label}>Date of Birth</span>
              <span className={styles.value}>{request.dob}</span>
            </div>

            <div className={styles.group}>
              <span className={styles.label}>Country</span>
              <span className={styles.value}>{request.country}</span>
            </div>

            <div className={styles.group}>
              <span className={styles.label}>Document Type</span>
              <span className={styles.value}>{request.documentType.replace('_', ' ')}</span>
            </div>

            <div className={styles.group}>
              <span className={styles.label}>Email</span>
              <span className={styles.value}>{request.user.email}</span>
            </div>

            <div className={styles.actions}>
              <button 
                className={`${styles.btn} ${styles.reject}`} 
                onClick={() => handleAction('REJECT')}
                disabled={processing}
              >
                Reject
              </button>
              <button 
                className={`${styles.btn} ${styles.approve}`} 
                onClick={() => handleAction('APPROVE')}
                disabled={processing}
              >
                Approve
              </button>
            </div>
          </div>

          {/* Images - Using URLs directly from API */}
          <div className={styles.imagePanel}>
            <div>
              <span className={styles.imgLabel}>Front Document</span>
              <a href={request.documentFrontUrl} target="_blank" rel="noreferrer">
                <img 
                  src={request.documentFrontUrl} 
                  alt="Front ID" 
                  className={styles.docImage} 
                />
              </a>
            </div>
            
            {request.documentBackUrl && (
              <div>
                <span className={styles.imgLabel}>Back Document</span>
                <a href={request.documentBackUrl} target="_blank" rel="noreferrer">
                  <img 
                    src={request.documentBackUrl} 
                    alt="Back ID" 
                    className={styles.docImage} 
                  />
                </a>
              </div>
            )}

            {request.selfieUrl && (
              <div>
                <span className={styles.imgLabel}>Selfie</span>
                <a href={request.selfieUrl} target="_blank" rel="noreferrer">
                  <img 
                    src={request.selfieUrl} 
                    alt="Selfie" 
                    className={styles.docImage} 
                  />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};