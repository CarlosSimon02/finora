"use server";

import { authConfig } from "@/config/nextFirebaseAuthEdge";
import { User } from "@/core/schemas/userSchema";
import { onboardUser, verifyIdToken } from "@/core/useCases/auth/admin";
import { signOut } from "@/core/useCases/auth/client";
import { AuthAdminRepository } from "@/data/repositories/AuthAdminRepository";
import { AuthClientRepository } from "@/data/repositories/AuthClientRepository";
import { UserRepository } from "@/data/repositories/UserRespository";
import { tokensToUser } from "@/lib/authTokens";
import { getServerActionError } from "@/lib/serverActionError";
import { ServerActionResponse } from "@/types";
import { refreshCookiesWithIdToken } from "next-firebase-auth-edge/lib/next/cookies";
import { removeServerCookies } from "next-firebase-auth-edge/next/cookies";
import { cookies, headers } from "next/headers";

const authAdminRepository = new AuthAdminRepository();
const authClientRepository = new AuthClientRepository();
const userRepository = new UserRepository();

export const postSignInAction = async (
  idToken: string,
  additionalInfo?: { name?: string }
): Promise<ServerActionResponse<{ user: User }>> => {
  try {
    const decodedIdToken = await verifyIdToken(authAdminRepository)(idToken);
    const userEntityFromToken = tokensToUser(decodedIdToken);
    const user: User = {
      ...userEntityFromToken,
      displayName: additionalInfo?.name ?? userEntityFromToken.displayName,
    };

    const databaseUser = await onboardUser(
      userRepository,
      authAdminRepository
    )(user);

    await refreshCookiesWithIdToken(
      idToken,
      await headers(),
      await cookies(),
      authConfig
    );

    return { data: { user: databaseUser }, error: null };
  } catch (error) {
    return getServerActionError(error);
  }
};

export const logoutAction = async () => {
  await signOut(authClientRepository)();

  removeServerCookies(await cookies(), { cookieName: authConfig.cookieName });
};
