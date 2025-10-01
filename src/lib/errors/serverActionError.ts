import { ServerActionResponse } from "@/types";
import {
  AuthError,
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
  if (error instanceof ValidationError) return error.errors;
  if (error instanceof z.ZodError) {
    return error.flatten().fieldErrors as unknown as Record<
      string,
      string | undefined
    >;
  }
  return undefined;
};

type ErrorMeta = { code?: string; status: number };

/**
 * Return code/status for known custom errors.
 * Keep mapping centralized so it's easy to update.
 */
const getErrorMeta = (error: unknown): ErrorMeta => {
  if (error instanceof ConflictError) return { code: "CONFLICT", status: 409 };
  if (error instanceof NotFoundError) return { code: "NOT_FOUND", status: 404 };
  if (error instanceof DomainValidationError)
    return { code: "DOMAIN_VALIDATION", status: 400 };
  if (error instanceof ValidationError || error instanceof z.ZodError)
    return { code: "VALIDATION", status: 400 };
  if (error instanceof AuthError) return { code: "AUTH", status: 401 };
  if (error instanceof DatasourceError) return { status: 500 };
  // fallback
  return { status: 500 };
};

export const getServerActionError = (error: unknown) => {
  const message = getErrorMessage(error);
  const validationErrors = getValidationErrors(error);
  const { code, status } = getErrorMeta(error);

  return {
    data: null,
    error: message,
    validationErrors,
    code,
    status,
  } as ServerActionResponse<never> & { code?: string; status?: number };
};
