import { adminAuth } from "@/infrastructure/firebase/firebaseAdmin";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  try {
    const guestUid = "guest";
    const guestEmail = "guest@example.com";

    // Ensure the guest user exists with an email for downstream mapping
    try {
      await adminAuth.getUser(guestUid);
    } catch {
      await adminAuth.createUser({
        uid: guestUid,
        email: guestEmail,
        emailVerified: false,
        displayName: "Guest",
      });
    }

    // Always enforce guest role claim
    await adminAuth.setCustomUserClaims(guestUid, { role: "guest" });

    // Mint a short-lived custom token
    const customToken = await adminAuth.createCustomToken(guestUid, {
      role: "guest",
      // Optionally carry minimal context
      purpose: "demo",
    });

    return NextResponse.json({ token: customToken }, { status: 200 });
  } catch (error) {
    console.error("Failed to create guest token", error);
    return NextResponse.json(
      { error: "Failed to create guest token" },
      { status: 500 }
    );
  }
}
