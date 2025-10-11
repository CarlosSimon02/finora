import { authConfig } from "@/config/nextFirebaseAuthEdge";
import { tokensToUser } from "@/lib/auth/authTokens";
import { t as tInstance } from "@/server/init";
import { ERROR_CODES } from "@/utils";
import { TRPCError } from "@trpc/server";
import { getTokens } from "next-firebase-auth-edge";
import { NextRequest } from "next/server";

export interface AuthContext {
  req: NextRequest;
}

export const createAuthMiddleware = (t: typeof tInstance) => {
  return t.middleware(async ({ ctx, next }) => {
    const tokens = await getTokens(ctx.req.cookies, authConfig);

    if (!tokens) {
      throw new TRPCError({
        code: ERROR_CODES.AUTH,
        message: "Unauthorized",
      });
    }

    const isGuest = tokens.decodedToken.role === "guest";

    if (!tokens.decodedToken.email_verified && !isGuest) {
      throw new TRPCError({
        code: ERROR_CODES.AUTH,
        message: "Unauthorized",
        cause: "Email not verified",
      });
    }

    const user = tokensToUser(tokens.decodedToken);
    return next({ ctx: { ...ctx, user } });
  });
};

export const createNonGuestMiddleware = (t: typeof tInstance) => {
  return t.middleware(async ({ ctx, next }) => {
    const role = ctx.user?.customClaims?.role as string | undefined;

    if (role === "guest") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Guest users cannot perform write operations",
      });
    }

    return next();
  });
};
