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
    const tree = z.treeifyError(error);
    const toFlat = (
      node: any,
      path: string = "",
      acc: Record<string, string | undefined> = {}
    ): Record<string, string | undefined> => {
      const firstError: string | undefined = Array.isArray(node?.errors)
        ? node.errors[0]
        : undefined;
      if (path && firstError) acc[path] = firstError;
      if (node?.properties && typeof node.properties === "object") {
        for (const key of Object.keys(node.properties)) {
          toFlat(node.properties[key], path ? `${path}.${key}` : key, acc);
        }
      }
      if (Array.isArray(node?.items)) {
        node.items.forEach((item: any, index: number) => {
          if (!item) return;
          const nextPath = path ? `${path}[${index}]` : `[${index}]`;
          toFlat(item, nextPath, acc);
        });
      }
      return acc;
    };
    validationErrors = toFlat(tree);
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
