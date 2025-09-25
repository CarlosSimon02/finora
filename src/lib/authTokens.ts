import { authConfig } from "@/config/nextFirebaseAuthEdge";
import { User } from "@/core/schemas";
import { DecodedIdToken } from "firebase-admin/auth";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { cache } from "react";

export const getAuthTokens = cache(async () => {
  const cookieStore = await cookies();

  try {
    const tokens = await getTokens(cookieStore, authConfig);

    return tokens;
  } catch (error) {
    console.error("Error fetching authentication tokens:", error);
    throw new Error("Failed to fetch authentication tokens.");
  }
});

export function tokensToUser(decodedToken: DecodedIdToken): User {
  const { uid, email, picture, name } = decodedToken;

  return {
    id: uid,
    email: email!,
    displayName: name,
    photoURL: picture,
  };
}
