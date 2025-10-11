import { LOG_MESSAGES } from "@/server/constants";

import {
  createAuthMiddleware,
  createErrorHandlingMiddleware,
  createNonGuestMiddleware,
} from "@/server/middlewares";

import { TRPCLogger } from "@/server/utils";
import { t } from "./init";

// Middleware
const errorHandlingMiddleware = createErrorHandlingMiddleware(t);
const authMiddleware = createAuthMiddleware(t);
const nonGuestMiddleware = createNonGuestMiddleware(t);

// Base Procedures
export const publicProcedure = t.procedure.use(errorHandlingMiddleware);
export const protectedProcedure = publicProcedure.use(authMiddleware);
export const protectedWriteProcedure =
  protectedProcedure.use(nonGuestMiddleware);

// TRPC Utilities
export const createCallerFactory = t.createCallerFactory;
export const mergeRouters = t.mergeRouters;
export const router = t.router;

// Export types for use in routers
export type Router = typeof router;
export type PublicProcedure = typeof publicProcedure;
export type ProtectedProcedure = typeof protectedProcedure;
export type ProtectedWriteProcedure = typeof protectedWriteProcedure;

// Log setup completion
TRPCLogger.info(LOG_MESSAGES.MIDDLEWARE_SETUP);
TRPCLogger.info(LOG_MESSAGES.PROCEDURES_EXPORTED);
