import { UserDto } from "@/core/schemas";
import { DecodedIdToken } from "firebase-admin/auth";

export interface IAuthAdminRepository {
  verifyIdToken(idToken: string): Promise<DecodedIdToken>;
  getUser(uid: string): Promise<UserDto>;
  createUser(email: string, password: string): Promise<UserDto>;
  updateUserDisplayName(uid: string, displayName?: string): Promise<void>;
  deleteUser(uid: string): Promise<void>;
  setCustomUserClaims(uid: string, claims: object): Promise<void>;
}
