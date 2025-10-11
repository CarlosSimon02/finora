import { authConfig } from "@/config/nextFirebaseAuthEdge";
import { User } from "@/core/schemas";
import { onboardUser, verifyIdToken } from "@/core/useCases/auth/admin";
import { AuthAdminRepository } from "@/data/repositories/AuthAdminRepository";
import { UserRepository } from "@/data/repositories/UserRespository";
import { tokensToUser } from "@/lib/auth/authTokens";
import { publicProcedure, router } from "@/server/trpc";
import { AuthError } from "@/utils";
import { getFirebaseAuth, getTokens } from "next-firebase-auth-edge";
import {
  refreshCookiesWithIdToken,
  refreshNextResponseCookies,
} from "next-firebase-auth-edge/lib/next/cookies";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import z from "zod";

const authAdminRepository = new AuthAdminRepository();
const userRepository = new UserRepository();

const { setCustomUserClaims, getUser } = getFirebaseAuth({
  serviceAccount: authConfig.serviceAccount,
  apiKey: authConfig.apiKey,
});

export const authRouter = router({
  postSignIn: publicProcedure
    .input(
      z.object({
        idToken: z.string(),
        additionalInfo: z
          .object({
            name: z.string().optional(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const decodedIdToken = await verifyIdToken(authAdminRepository)(
        input.idToken
      );
      const userEntityFromToken = tokensToUser(decodedIdToken);
      const user: User = {
        ...userEntityFromToken,
        displayName:
          input.additionalInfo?.name ?? userEntityFromToken.displayName,
      };
      const databaseUser = await onboardUser(
        userRepository,
        authAdminRepository
      )(user);
      await refreshCookiesWithIdToken(
        input.idToken,
        await headers(),
        await cookies(),
        authConfig
      );
      return { user: databaseUser };
    }),
  refreshCredentials: publicProcedure.mutation(async ({ ctx }) => {
    const tokens = await getTokens(ctx.req.cookies, authConfig);
    if (!tokens) {
      throw new AuthError("Unauthenticated");
    }

    await setCustomUserClaims(tokens.decodedToken.uid, {
      someCustomClaim: {
        updatedAt: Date.now(),
      },
    });
    const user = await getUser(tokens.decodedToken.uid);
    const response = new NextResponse(
      JSON.stringify({
        customClaims: user?.customClaims,
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      }
    );

    return refreshNextResponseCookies(ctx.req, response, authConfig);
  }),
});
