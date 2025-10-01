import { authConfig } from "@/config/nextFirebaseAuthEdge";
import { tokensToUser } from "@/lib/auth/authTokens";
import {
  AuthError,
  ConflictError,
  DatasourceError,
  DomainValidationError,
  NotFoundError,
  ValidationError,
} from "@/utils";
import { initTRPC, TRPCError } from "@trpc/server";
import { getTokens } from "next-firebase-auth-edge";
import { NextRequest } from "next/server";
import { cache } from "react";
import superjson from "superjson";
import { z } from "zod";
import { treeToFieldErrors } from "./utils";

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
  // Ensure clients receive consistent error payloads
  errorFormatter({ shape, error }) {
    const cause = error.cause as unknown;

    const getValidationErrors = (
      err: unknown
    ): Record<string, string | undefined> | undefined => {
      if (err instanceof ValidationError) return err.errors;
      if (err instanceof z.ZodError) {
        const tree = z.treeifyError(err);
        return treeToFieldErrors(tree);
      }
      return undefined;
    };

    const validationErrors = getValidationErrors(cause);

    return {
      ...shape,
      data: {
        ...shape.data,
        // Surface domain/validation errors in a stable field
        validationErrors,
      },
    };
  },
});
export const createCallerFactory = t.createCallerFactory;

// Map domain errors to tRPC errors with appropriate codes
function mapToTrpcError(err: unknown): TRPCError {
  if (err instanceof TRPCError) return err;
  if (err instanceof ConflictError)
    return new TRPCError({
      code: "CONFLICT",
      message: err.message,
      cause: err,
    });
  if (err instanceof NotFoundError)
    return new TRPCError({
      code: "NOT_FOUND",
      message: err.message,
      cause: err,
    });
  if (err instanceof DomainValidationError || err instanceof ValidationError)
    return new TRPCError({
      code: "BAD_REQUEST",
      message: err.message,
      cause: err,
    });
  if (err instanceof AuthError)
    return new TRPCError({
      code: "UNAUTHORIZED",
      message: err.message,
      cause: err,
    });
  if (err instanceof DatasourceError)
    return new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: err.message,
      cause: err,
    });
  if (err instanceof z.ZodError)
    return new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid input",
      cause: err,
    });
  // Fallback
  return new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: err });
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
