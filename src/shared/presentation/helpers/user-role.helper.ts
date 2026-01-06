import { UserRole } from "src/modules/auth/domain/models/roles";
import type { UserProfile } from "../../../modules/auth/domain/models/user";

export class UserRoleHelper {
  static isProfileComplete(user: UserProfile | null): boolean {
    return !!user;
  }

  static isAdmin(role: UserRole): boolean {
    return role === UserRole.ADMIN;
  }

  static isHelper(role: UserRole): boolean {
    return role === UserRole.ADMIN;
  }
}