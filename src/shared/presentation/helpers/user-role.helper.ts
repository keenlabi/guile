import { UserRole } from "../../../features/auth/domain/models/roles";
import type { UserProfile } from "../../../features/auth/domain/models/user";

export class UserRoleHelper {
  constructor() {}
  /**
   * Checks if a user has a specific role.
   * Safe to use with null/undefined user objects.
   */
  static hasRole(user: UserProfile | null, role: UserRole | string): boolean {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  }
  
  /**
   * Determines if the Seeker profile is considered "complete".
   * Currently checks for the existence of a first name.
   */
  static isSeekerProfileComplete(user: UserProfile | null): boolean {
    if (!user) return false;
    // TODO: Add more specific checks if needed (e.g. skills, location)
    return !!user.firstName && this.hasRole(user, UserRole.SEEKER);
  }

  /**
   * Determines if the Employer profile is considered "complete".
   */
  static isEmployerProfileComplete(user: UserProfile | null): boolean {
    if (!user) return false;
    // TODO: Check for company name, registration number, etc.
    // For now, return false or check basic fields if available
    return this.hasRole(user, UserRole.BUSINESS) && false; 
  }
  
  /**
   * Determines if the Business profile is considered "complete".
   * Currently a placeholder as Business features are in development.
   */
  static isBusinessProfileComplete(user: UserProfile | null): boolean {
    if (!user) return false;
    // TODO: Check for company name, registration number, etc.
    // For now, return false or check basic fields if available
    return this.hasRole(user, UserRole.BUSINESS) && false; 
  }
  
  /**
   * Generic check to see if the user has ANY completed profile path.
   * Used by ProfileGuard to determine if they should land on Dashboard or ChoosePath.
   */
  static isProfileComplete(user: UserProfile | null): boolean {
    return this.isSeekerProfileComplete(user) || this.isBusinessProfileComplete(user);
  }
}