import { ServerActionResponse } from "@/types/serverActionResponse";
import { z } from "zod";
import {
  ConflictError,
  DomainValidationError,
  NotFoundError,
  ValidationError,
} from "./errors";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unknown error occurred";
};

const getValidationErrors = (
  error: unknown
): Record<string, string | undefined> | undefined => {
  if (error instanceof ValidationError) {
    return error.errors;
  }
  return undefined;
};

export const getServerActionError = (error: unknown) => {
  let message = getErrorMessage(error);
  let validationErrors = getValidationErrors(error);

  if (error instanceof z.ZodError) {
    validationErrors = error.flatten().fieldErrors as Record<
      string,
      string | undefined
    >;
    message = "Validation failed";
  }

  // Optionally, attach a code for client-side mapping if needed later
  const code =
    error instanceof ConflictError
      ? "CONFLICT"
      : error instanceof NotFoundError
        ? "NOT_FOUND"
        : error instanceof DomainValidationError
          ? "DOMAIN_VALIDATION"
          : error instanceof ValidationError
            ? "VALIDATION"
            : undefined;

  return {
    data: null,
    error: message,
    validationErrors,
    code,
  } as ServerActionResponse<never> & { code?: string };
};
