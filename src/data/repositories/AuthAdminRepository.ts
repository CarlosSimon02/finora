import { IAuthAdminRepository } from "@/core/interfaces/IAuthAdminRepository";
import { UserDto } from "@/core/schemas";
import { mapUserRecordToDto } from "@/data/mappers";
import { adminAuth } from "@/infrastructure/firebase/firebaseAdmin";
import { DecodedIdToken } from "firebase-admin/auth";

export class AuthAdminRepository implements IAuthAdminRepository {
  constructor() {}

  async verifyIdToken(idToken: string): Promise<DecodedIdToken> {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  }

  async getUser(id: string): Promise<UserDto> {
    const userRecord = await adminAuth.getUser(id);
    return mapUserRecordToDto(userRecord);
  }

  async createUser(email: string, password: string): Promise<UserDto> {
    const userRecord = await adminAuth.createUser({ email, password });
    return mapUserRecordToDto(userRecord);
  }

  async updateUserDisplayName(
    uid: string,
    displayName?: string
  ): Promise<void> {
    await adminAuth.updateUser(uid, { displayName });
  }

  async deleteUser(uid: string): Promise<void> {
    await adminAuth.deleteUser(uid);
  }

  async setCustomUserClaims(uid: string, claims: object): Promise<void> {
    await adminAuth.setCustomUserClaims(uid, claims);
  }

  async markEmailAsVerified(uid: string): Promise<void> {
    await adminAuth.updateUser(uid, { emailVerified: true });
  }
}
