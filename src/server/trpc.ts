import { authConfig } from "@/config/nextFirebaseAuthEdge";
import { tokensToUser } from "@/lib/auth/authTokens";
import { getErrorMetadata, getValidationErrors } from "@/utils";
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

// Global error adapter so all procedures share consistent error mapping
const errorAdapter = t.middleware(async ({ next }) => {
  try {
    return await next();
  } catch (err) {
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

export const router = t.router;
export const publicProcedure = t.procedure.use(errorAdapter);
export const protectedProcedure = publicProcedure.use(isAuthenticated);
