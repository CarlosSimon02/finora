export const LOG_MESSAGES = {
  PROCEDURE_START: (type: string, path: string) =>
    `[TRPC] ${type.toUpperCase()} ${path} - Started`,
  PROCEDURE_SUCCESS: (type: string, path: string, duration: number) =>
    `[TRPC] ${type.toUpperCase()} ${path} - Success (${duration}ms)`,
  MIDDLEWARE_SETUP: "[TRPC] Middleware setup complete - errorAdapter is active",
  PROCEDURES_EXPORTED:
    "[TRPC] publicProcedure and protectedProcedure exported successfully",
} as const;
