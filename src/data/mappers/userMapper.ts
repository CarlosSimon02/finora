import { UserDto } from "@/core/schemas";
import { UserModel } from "@/data/models";
import { UserRecord } from "firebase-admin/auth";

export const mapUserRecordToDto = (user: UserRecord): UserDto => ({
  id: user.uid,
  email: user.email ?? "",
  displayName: user.displayName ?? undefined,
  photoURL: user.photoURL ?? undefined,
  phoneNumber: user.phoneNumber ?? undefined,
  createdAt: new Date(user.metadata.creationTime),
  updatedAt: new Date(user.metadata.lastSignInTime),
  customClaims: user.customClaims ?? {},
});

export const mapUserModelToDto = (user: UserModel): UserDto => ({
  id: user.id,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
  phoneNumber: user.phoneNumber,
  createdAt: user.createdAt.toDate(),
  updatedAt: user.updatedAt.toDate(),
  customClaims: user.customClaims,
});
