import { ServerActionResponse } from "@/types";
import {
  ConflictError,
  DatasourceError,
  DomainValidationError,
  NotFoundError,
  ValidationError,
} from "@/utils";
import { z } from "zod";

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

  // Optionally, attach a code and status for client-side mapping if needed
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

  const status =
    error instanceof ConflictError
      ? 409
      : error instanceof NotFoundError
        ? 404
        : error instanceof DomainValidationError ||
            error instanceof z.ZodError ||
            error instanceof ValidationError
          ? 400
          : error instanceof DatasourceError
            ? 500
            : 500;

  return {
    data: null,
    error: message,
    validationErrors,
    code,
    status,
  } as ServerActionResponse<never> & { code?: string; status?: number };
};
