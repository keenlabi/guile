import { useEffect, useState } from 'react';
import styles from "./TraderProfileLayout.module.css";
import { Outlet, NavLink, useParams, useNavigate } from 'react-router-dom';
import { adminRepository } from 'src/modules/admin/infrastructure/repositories/admin.repository';
import type { UserProfile } from 'src/modules/auth/domain/models/user';

export const TraderProfileLayout = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (id) {
      adminRepository.getProfileByUserId(id).then(setProfile);
    }
  }, [id]);

  if (!profile) return <div>Loading Trader Profile...</div>;

  return (
    <div style={{ padding: '3.2rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Back Button */}
      <button onClick={() => navigate('/admin/traders')} style={{ marginBottom: '1rem', border: 'none', background: 'none', cursor: 'pointer', color: '#666' }}>
        ← Back to Directory
      </button>

      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.6rem', marginBottom: '3.2rem' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
          {profile.firstName?.[0]}
        </div>
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 700 }}>{profile.firstName} {profile.lastName}</h1>
          <p style={{ color: '#666' }}>{profile.email} • <span style={{ color: 'green' }}>{profile.status}</span></p>
        </div>
      </div>

      {/* Horizontal Subnav */}
      <div style={{ display: 'flex', gap: '2.4rem', borderBottom: '1px solid #eee', marginBottom: '2.4rem' }}>
        {/* <NavLink 
          to={`/admin/traders/${id}/overview`}
          style={({ isActive }) => ({ 
            padding: '1rem 0', 
            borderBottom: isActive ? '2px solid black' : '2px solid transparent',
            color: isActive ? 'black' : '#666',
            fontWeight: isActive ? 600 : 400
          })}
        >
          Overview
        </NavLink> */}
        <NavLink 
          to={`/admin/traders/${id}/wallet`}
          style={({ isActive }) => ({ 
            padding: '1rem 0', 
            borderBottom: isActive ? '2px solid black' : '2px solid transparent',
            color: isActive ? 'black' : '#666',
            fontWeight: isActive ? 600 : 400
          })}
        >
          Wallets
        </NavLink>
        <NavLink 
          to={`/admin/traders/${id}/predictions`} // <--- NEW LINK
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
        >
          Predictions
        </NavLink>
        <NavLink 
          to={`/admin/traders/${id}/activity`}
          style={({ isActive }) => ({ 
            padding: '1rem 0', 
            borderBottom: isActive ? '2px solid black' : '2px solid transparent',
            color: isActive ? 'black' : '#666',
            fontWeight: isActive ? 600 : 400
          })}
        >
          Activity
        </NavLink>
      </div>

      {/* Render the specific tab content */}
      <Outlet context={{ profile }} />
    </div>
  );
};