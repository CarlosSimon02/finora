// Global test setup for Vitest
process.env.TZ = "UTC";

// Stub env to avoid @t3-oss/env-nextjs validation in unit tests
process.env.FIREBASE_CLIENT_EMAIL =
  process.env.FIREBASE_CLIENT_EMAIL || "test@example.com";
process.env.FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY || "test";
process.env.USE_SECURE_COOKIES = process.env.USE_SECURE_COOKIES || "false";
process.env.COOKIE_SECRET_CURRENT =
  process.env.COOKIE_SECRET_CURRENT || "secret1";
process.env.COOKIE_SECRET_PREVIOUS =
  process.env.COOKIE_SECRET_PREVIOUS || "secret0";
process.env.ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID || "app";
process.env.ALGOLIA_API_KEY = process.env.ALGOLIA_API_KEY || "key";
process.env.NEXT_PUBLIC_FIREBASE_API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "api";
process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN =
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "domain";
process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID =
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "sender";
process.env.NEXT_PUBLIC_FIREBASE_APP_ID =
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "appId";
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "proj";
process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "bucket";
process.env.NEXT_PUBLIC_IS_USING_EMULATORS =
  process.env.NEXT_PUBLIC_IS_USING_EMULATORS || "false";
process.env.NEXT_PUBLIC_EMULATOR_HOST =
  process.env.NEXT_PUBLIC_EMULATOR_HOST || "localhost";
process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT =
  process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT || "8080";
process.env.NEXT_PUBLIC_STORAGE_EMULATOR_PORT =
  process.env.NEXT_PUBLIC_STORAGE_EMULATOR_PORT || "9199";
process.env.NEXT_PUBLIC_FUNCTIONS_EMULATOR_PORT =
  process.env.NEXT_PUBLIC_FUNCTIONS_EMULATOR_PORT || "5001";
process.env.NEXT_PUBLIC_AUTH_EMULATOR_HOST =
  process.env.NEXT_PUBLIC_AUTH_EMULATOR_HOST || "localhost";
process.env.NEXT_PUBLIC_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
