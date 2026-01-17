import { ArrowRight, Lock, ShieldAlert, ShieldCheck } from 'lucide-react';
import styles from './UserProfilePage.module.css';
import { useAuth } from 'src/shared/presentation/hooks/useAuth';
import { ROUTES } from 'src/shared/presentation/routes/routes';
import { useNavigate } from 'react-router-dom';

export const UserProfilePage = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  // Fallback values if profile is loading or missing
  const email = profile?.email || 'Loading...';
  const userId = profile?.id || '---';
  // Use first letter of email as avatar if name isn't available
  const avatarLetter = (profile?.firstName?.[0] || profile?.email?.[0] || 'U').toUpperCase();

  // You can replace this with actual backend status check
  const isVerified = false;

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
          <div style={{ color: '#0ecb81', display: 'flex', gap: '6px', alignItems: 'center', fontSize: '1.2rem', fontWeight: 600 }}>
            <ShieldCheck size={18} />
            <span>Verified</span>
          </div>
        </div>

        {!isVerified && (
          <div className={styles.verificationBanner}>
            <div className={styles.bannerContent}>
              <h3>
                <ShieldAlert size={20} color="#22c55e" /> 
                Complete Verification
              </h3>
              <p>Verify your identity to unlock unlimited withdrawals, P2P trading, and higher deposit limits.</p>
            </div>
            
            <button className={styles.bannerBtn} onClick={handleKycClick}>
              Verify Now <ArrowRight size={18} />
            </button>
            
            {/* Decorative Glow */}
            <div className={styles.bannerDecor} />
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
          
          {/* Email Field */}
          <div className={styles.inputGroup}>
            <div className={styles.label}>
              Email Address
              <span className={styles.readOnlyTag}>Non-editable</span>
            </div>
            <div className={styles.inputWrapper}>
              <input 
                type="email" 
                value={email} 
                readOnly 
                className={styles.input}
              />
              <div className={styles.lockIcon}>
                <Lock size={16} />
              </div>
            </div>
          </div>

          {/* Role Field */}
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
              <div className={styles.lockIcon}>
                <Lock size={16} />
              </div>
            </div>
          </div>

        </form>

        {/* <div className={styles.footer}>
          <button className={styles.btnSecondary}>Change Password</button>
          <button className={styles.btnSecondary}>Security Log</button>
        </div> */}

      </div>
    </div>
  );
};