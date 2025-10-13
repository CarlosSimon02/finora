"use server";

import { authConfig } from "@/config/nextFirebaseAuthEdge";
import { signOut } from "@/core/useCases/auth/client";
import { AuthClientRepository } from "@/data/repositories/AuthClientRepository";
import {
  revalidateBudgetsCache,
  revalidateIncomesCache,
  revalidatePotsCache,
  revalidateTransactionsCache,
} from "@/server/utils";
import { ServerActionResponse } from "@/types";
import {
  AuthError,
  getErrorMessage,
  getErrorMetadata,
  getValidationErrors,
} from "@/utils";
import { refreshServerCookies } from "next-firebase-auth-edge/lib/next/cookies";
import { removeServerCookies } from "next-firebase-auth-edge/next/cookies";
import { getTokens } from "next-firebase-auth-edge/next/tokens";
import { cookies, headers } from "next/headers";

const getServerActionError = (error: unknown) => {
  const message = getErrorMessage(error);
  const validationErrors = getValidationErrors(error);
  const { code, status } = getErrorMetadata(error);

  return {
    data: null,
    error: message,
    validationErrors,
    code,
    status,
  } as ServerActionResponse<never> & { code?: string; status: number };
};

const authClientRepository = new AuthClientRepository();

export const logoutAction = async () => {
  await signOut(authClientRepository)();

  removeServerCookies(await cookies(), { cookieName: authConfig.cookieName });
};

export const refreshCredentialsAction = async () => {
  try {
    const tokens = await getTokens(await cookies(), authConfig);

    if (!tokens) {
      throw new AuthError("Unauthenticated");
    }

    await refreshServerCookies(
      await cookies(),
      new Headers(await headers()),
      authConfig
    );

    revalidateBudgetsCache();
    revalidateIncomesCache();
    revalidatePotsCache();
    revalidateTransactionsCache();
  } catch (error) {
    return getServerActionError(error);
  }
};
