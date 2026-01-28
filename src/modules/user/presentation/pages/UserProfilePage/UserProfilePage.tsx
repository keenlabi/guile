import { useEffect } from 'react';
import { ArrowRight, Lock, ShieldAlert, ShieldCheck, Clock, AlertTriangle } from 'lucide-react'; // Added icons
import styles from './UserProfilePage.module.css';
import { useAuth } from 'src/shared/presentation/hooks/useAuth';
import { ROUTES } from 'src/shared/presentation/routes/routes';
import { useNavigate } from 'react-router-dom';
import { useKyc } from '../../hooks/useKyc';

export const UserProfilePage = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { fetchKycStatus, kycStatus } = useKyc();

  useEffect(() => {
    fetchKycStatus();
  }, [fetchKycStatus]);

  // Derived State
  const email = profile?.email || 'Loading...';
  const userId = profile?.id || '---';
  const avatarLetter = (profile?.firstName?.[0] || profile?.email?.[0] || 'U').toUpperCase();
  
  const status = kycStatus?.status || 'NOT_SUBMITTED';
  const isVerified = status === 'APPROVED';

  const handleKycClick = () => {
    navigate(ROUTES.KYC);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Account Settings</h1>
            <p className={styles.subtitle}>Manage your profile and security preferences</p>
          </div>
          
          {isVerified ? (
            <div className={styles.verifiedBadge}>
              <ShieldCheck size={18} />
              <span>Verified</span>
            </div>
          ) : (
            <div className={styles.unverifiedBadge}>
              <ShieldAlert size={18} />
              <span>Unverified</span>
            </div>
          )}
        </div>

        {/* DYNAMIC BANNER SECTION */}
        
        {/* 1. NOT SUBMITTED: Show "Verify Now" */}
        {status === 'NOT_SUBMITTED' && (
          <div className={`${styles.verificationBanner} ${styles.bannerDefault}`}>
            <div className={styles.bannerContent}>
              <h3>
                <ShieldAlert size={20} color="#22c55e" /> 
                Complete Verification
              </h3>
              <p>Verify your identity to unlock unlimited withdrawals and P2P trading.</p>
            </div>
            <button className={styles.bannerBtn} onClick={handleKycClick}>
              Verify Now <ArrowRight size={18} />
            </button>
            <div className={styles.bannerDecor} />
          </div>
        )}

        {/* 2. PENDING: Show "In Review" */}
        {status === 'PENDING' && (
          <div className={`${styles.verificationBanner} ${styles.bannerPending}`}>
            <div className={styles.bannerContent}>
              <h3>
                <Clock size={20} color="#FCD535" /> 
                Verification In Progress
              </h3>
              <p>We are reviewing your documents. This usually takes 24 hours.</p>
            </div>
            {/* No button needed, or maybe a disabled "Processing" button */}
          </div>
        )}

        {/* 3. REJECTED: Show "Failed" + Reason */}
        {status === 'REJECTED' && (
          <div className={`${styles.verificationBanner} ${styles.bannerRejected}`}>
            <div className={styles.bannerContent}>
              <h3>
                <AlertTriangle size={20} color="#f6465d" /> 
                Verification Failed
              </h3>
              <p>Reason: {kycStatus?.rejectionReason || "Documents unclear"}</p>
            </div>
            <button className={`${styles.bannerBtn} ${styles.btnRetry}`} onClick={handleKycClick}>
              Try Again <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Avatar & ID */}
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            {avatarLetter}
          </div>
          <div className={styles.idBadge}>
            <span className={styles.userIdLabel}>User ID</span>
            <span className={styles.userIdValue}>{userId}</span>
          </div>
        </div>

        {/* Read-Only Form */}
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <div className={styles.label}>
              Email Address
              <span className={styles.readOnlyTag}>Non-editable</span>
            </div>
            <div className={styles.inputWrapper}>
              <input type="email" value={email} readOnly className={styles.input} />
              <div className={styles.lockIcon}><Lock size={16} /></div>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.label}>
              Account Type
              <span className={styles.readOnlyTag}>System managed</span>
            </div>
            <div className={styles.inputWrapper}>
              <input 
                type="text" 
                value={profile?.role || 'TRADER'} 
                readOnly 
                className={styles.input}
                style={{ textTransform: 'uppercase' }}
              />
              <div className={styles.lockIcon}><Lock size={16} /></div>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};