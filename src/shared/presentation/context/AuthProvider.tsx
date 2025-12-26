import { useMemo, useState, useEffect, type ReactNode } from "react";
import type { UserProfile } from "../../../features/auth/domain/models/user";
import { AuthContext } from "./AuthContext";
import authRepository from "../../../features/auth/infrastructure/repositories/auth.repository";

export function AuthProvider({ children }: { children: ReactNode }) {
  
  // const [user, setUser] = useState<AuthResponseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isFetchProfileLoading, setIsFetchProfileLoading] = useState(true);

  // Run once on mount to handle browser refreshes
  useEffect(() => {
    fetchProfile();
  }, []);

  // The Bootstrap Function: Checks who is logged in
  async function fetchProfile() {
    try {
      setIsFetchProfileLoading(true);
      const profile = await authRepository.getProfile();
      setProfile(profile);
    } catch (error) {
      console.log(error)
      // If 401 Unauthorized or network error, we assume no active session
      // We do not log this as an error because it's a normal state for a guest
      setProfile(null);
    } finally {
      setIsFetchProfileLoading(false);
    }
  };

  async function setLogin(profileData: UserProfile) {
    setProfile(profileData);
  };

  async function setLogout() {
    try {
      await authRepository.logout();
    } catch(e) {
      console.error(e);
    }
    setProfile(null);
  };

  const value = useMemo(() => ({
    profile,
    isAuthenticated: !!profile,
    isFetchProfileLoading,
    setLogin,
    setLogout,
    refreshProfile: fetchProfile
  }), [profile, isFetchProfileLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}