import type { UserRole } from "./roles";

export interface UserProfile {
  id: string;
  email: string;
  emailVerified: boolean;
  status: string;
  role: UserRole;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
}

export interface AuthResponseUser {
  id: string;
  email: string;
  role: string;
  emailVerified: boolean;
}