import { authConfig } from "@/config/nextFirebaseAuthEdge";
import { tokensToUser } from "@/lib/auth/authTokens";
import { debugLog, getErrorMetadata, getValidationErrors } from "@/utils";
import { initTRPC, TRPCError } from "@trpc/server";
import { getTokens } from "next-firebase-auth-edge";
import { NextRequest } from "next/server";
import { cache } from "react";
import superjson from "superjson";

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

export type CreateNextContextOptions = {
  req: Request;
};

export const createTRPCContext = cache(
  async (opts: CreateNextContextOptions) => {
    const nextReq = new NextRequest(opts.req.url, {
      headers: opts.req.headers,
      method: opts.req.method,
      body: opts.req.body,
    });
    return { req: nextReq };
  }
);

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    const cause = error.cause as unknown;
    const validationErrors = getValidationErrors(cause);

    return {
      ...shape,
      data: {
        ...shape.data,
        validationErrors,
      },
    };
  },
});
export const createCallerFactory = t.createCallerFactory;
export const mergeRouters = t.mergeRouters;

const TRPC_CODE_MAP: Record<
  string,
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_SERVER_ERROR"
> = {
  CONFLICT: "CONFLICT",
  NOT_FOUND: "NOT_FOUND",
  DOMAIN_VALIDATION: "BAD_REQUEST",
  VALIDATION: "BAD_REQUEST",
  AUTH: "UNAUTHORIZED",
  DATASOURCE: "INTERNAL_SERVER_ERROR",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
};

function mapToTrpcError(err: unknown): TRPCError {
  if (err instanceof TRPCError) return err;

  const { code } = getErrorMetadata(err);
  const trpcCode = TRPC_CODE_MAP[code];
  const message = err instanceof Error ? err.message : "An error occurred";

  return new TRPCError({
    code: trpcCode,
    message,
    cause: err,
  });
}

// Helper function to ensure error logging always works
function logError(message: string) {
  // Use multiple methods to ensure visibility
  console.error(message);
  console.log(message);
  if (typeof process !== "undefined" && process.stderr) {
    process.stderr.write(message + "\n");
  }
}

// Global error adapter so all procedures share consistent error mapping
const errorAdapter = t.middleware(async ({ next, path, type }) => {
  const startTime = Date.now();

  // Log every procedure call for debugging
  console.log(`[TRPC] ${type.toUpperCase()} ${path} - Started`);

  try {
    const result = await next();
    const duration = Date.now() - startTime;
    console.log(
      `[TRPC] ${type.toUpperCase()} ${path} - Success (${duration}ms)`
    );
    return result;
  } catch (err) {
    const duration = Date.now() - startTime;

    // Use all logging methods to ensure visibility
    const separator = "=".repeat(80);
    logError(separator);
    logError("❌ TRPC ERROR CAUGHT IN MIDDLEWARE");
    logError(separator);
    logError(`Procedure: ${path}`);
    logError(`Type: ${type}`);
    logError(`Duration: ${duration}ms`);
    logError(`Timestamp: ${new Date().toISOString()}`);
    logError(separator);

    if (err instanceof Error) {
      logError(`Error Name: ${err.name}`);
      logError(`Error Message: ${err.message}`);
      logError(`Stack Trace:`);
      logError(err.stack || "No stack trace available");

      // Log additional error properties
      const errAny = err as any;

      // Check for originalError (from our DatasourceError)
      if (errAny.originalError) {
        logError(`\n📍 Original Error (unwrapped):`);
        logError(`  Name: ${errAny.originalError.name}`);
        logError(`  Message: ${errAny.originalError.message}`);
        if (errAny.originalError.stack) {
          logError(`  Stack: ${errAny.originalError.stack}`);
        }

        // Check if original error has the Firestore index URL
        if (
          errAny.originalError.message &&
          errAny.originalError.message.includes("index")
        ) {
          logError("\n" + "⚠️".repeat(40));
          logError("⚠️  FIRESTORE INDEX REQUIRED!");
          logError("⚠️  This query requires a composite index.");
          logError("⚠️  Look for the URL in the error message above.");
          logError("⚠️  Click the URL to create the index automatically.");
          logError("⚠️".repeat(40));
        }
      }

      // Check for cause
      if ("cause" in err && err.cause) {
        logError(`\n📎 Error Cause:`);
        if (err.cause instanceof Error) {
          logError(`  Name: ${err.cause.name}`);
          logError(`  Message: ${err.cause.message}`);
          if (err.cause.stack) {
            logError(`  Stack: ${err.cause.stack}`);
          }
        } else {
          logError(JSON.stringify(err.cause, null, 2));
        }
      }

      // Special handling for Firestore errors in main message
      if (err.message && err.message.includes("index")) {
        logError("\n" + "⚠️".repeat(40));
        logError("⚠️  FIRESTORE INDEX REQUIRED!");
        logError("⚠️  This query requires a composite index.");
        logError("⚠️  Look for the URL in the error message above.");
        logError("⚠️  Click the URL to create the index automatically.");
        logError("⚠️".repeat(40));
      }
    } else {
      logError(`Unknown Error Type: ${typeof err}`);
      logError(`Error Value: ${JSON.stringify(err, null, 2)}`);
    }

    logError(separator);
    logError(""); // Empty line for readability

    // Also use debugLog as backup
    debugLog("TRPC", "Error Details", err);

    throw mapToTrpcError(err);
  }
});

const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  const { req } = ctx;
  const tokens = await getTokens(req.cookies, authConfig);

  if (!tokens) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  }

  if (!tokens.decodedToken.email_verified) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized",
      cause: "Email not verified",
    });
  }

  return next({ ctx: { user: tokensToUser(tokens.decodedToken) } });
});

// Log middleware setup on module load
console.log("[TRPC] Middleware setup complete - errorAdapter is active");

export const router = t.router;
export const publicProcedure = t.procedure.use(errorAdapter);
export const protectedProcedure = publicProcedure.use(isAuthenticated);

// Log that procedures are exported
console.log(
  "[TRPC] publicProcedure and protectedProcedure exported successfully"
);
