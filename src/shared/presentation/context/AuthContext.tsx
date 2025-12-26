import { createContext } from 'react';
import type { UserProfile } from '../../../modules/auth/domain/models/user';

export interface AuthContextType {
  profile: UserProfile | null;
  isFetchProfileLoading: boolean;
  // profile: UserProfile | null;
  isAuthenticated: boolean;
  // setLogin: (profileData: UserProfile) => void;
  // setLogout: () => void;
  refreshProfile: ()=> Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);