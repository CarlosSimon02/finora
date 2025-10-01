import { authConfig } from "@/config/nextFirebaseAuthEdge";
import { User } from "@/core/schemas/userSchema";
import { onboardUser, verifyIdToken } from "@/core/useCases/auth/admin";
import { AuthAdminRepository } from "@/data/repositories/AuthAdminRepository";
import { AuthClientRepository } from "@/data/repositories/AuthClientRepository";
import { UserRepository } from "@/data/repositories/UserRespository";
import { tokensToUser } from "@/lib/auth/authTokens";
import { refreshCookiesWithIdToken } from "next-firebase-auth-edge/lib/next/cookies";
import { cookies, headers } from "next/headers";
import { publicProcedure, router } from "./trpc";

const authAdminRepository = new AuthAdminRepository();
const authClientRepository = new AuthClientRepository();
const userRepository = new UserRepository();

export const authRouter = router({
  postSignIn: publicProcedure
    .input(
      (val: unknown) =>
        val as { idToken: string; additionalInfo?: { name?: string } }
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

  // logout: protectedProcedure.mutation(async () => {
  //   await signOut(authClientRepository)();
  //   removeServerCookies(await cookies(), { cookieName: authConfig.cookieName });
  //   return undefined;
  // }),

  // refreshCredentials: protectedProcedure.mutation(async () => {
  //   const tokens = await getTokens(await cookies(), authConfig);
  //   if (!tokens) {
  //     throw new AuthError("Unauthenticated");
  //   }
  //   await refreshServerCookies(
  //     await cookies(),
  //     new Headers(await headers()),
  //     authConfig
  //   );
  //   return undefined;
  // }),
});
