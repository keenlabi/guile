export enum UserRole {
  TRADER = 'trader',
  ADMIN = 'admin'
}

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.TRADER]: 'trader',
  [UserRole.ADMIN]: 'admin',
};