export enum UserRole {
  SEEKER = 'seeker',
  BUSINESS = 'business',
  EMPLOYER = 'employer', // If distinct from business
  ADMIN = 'admin'
}

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SEEKER]: 'Talent',
  [UserRole.BUSINESS]: 'Business',
  [UserRole.EMPLOYER]: 'Employer',
  [UserRole.ADMIN]: 'Admin',
};