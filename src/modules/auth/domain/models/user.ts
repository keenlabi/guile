export interface UserProfile {
  id: string;
  email: string;
  emailVerified: boolean;
  status: string;
  roles: string[];
  // These might be null if not onboarded yet
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  location?: {
    city?: string;
    province?: string;
  };
}

export interface AuthResponseUser {
  id: string;
  email: string;
  role: string[];
  emailVerified: boolean;
}