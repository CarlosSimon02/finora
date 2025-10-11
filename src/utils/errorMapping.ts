import { z } from "zod";
import {
  AuthError,
  ConflictError,
  DatasourceError,
  DomainValidationError,
  NotFoundError,
  ValidationError,
} from "./errors";

export const ERROR_CODES = {
  CONFLICT: "CONFLICT",
  NOT_FOUND: "NOT_FOUND",
  DOMAIN_VALIDATION: "BAD_REQUEST",
  VALIDATION: "BAD_REQUEST",
  AUTH: "UNAUTHORIZED",
  DATASOURCE: "INTERNAL_SERVER_ERROR",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;
export type MappedErrorCode = (typeof ERROR_CODES)[ErrorCode];

export type ErrorMetadata = {
  code: MappedErrorCode;
  status: number;
  isTrusted: boolean;
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unknown error occurred";
};

type TreeNode = {
  errors?: string[];
  properties?: Record<string, TreeNode>;
  items?: TreeNode[];
};

export const treeToFieldErrors = (
  tree: TreeNode,
  path: string = "",
  acc: Record<string, string | undefined> = {}
): Record<string, string | undefined> => {
  const firstError: string | undefined = Array.isArray(tree?.errors)
    ? tree.errors[0]
    : undefined;

  if (path && firstError) {
    acc[path] = firstError;
  }

  if (tree?.properties && typeof tree.properties === "object") {
    for (const key of Object.keys(tree.properties)) {
      treeToFieldErrors(
        tree.properties[key],
        path ? `${path}.${key}` : key,
        acc
      );
    }
  }

  if (Array.isArray(tree?.items)) {
    tree.items.forEach((item: TreeNode, index: number) => {
      if (!item) return;
      const nextPath = path ? `${path}[${index}]` : `[${index}]`;
      treeToFieldErrors(item, nextPath, acc);
    });
  }

  return acc;
};

export const getValidationErrors = (
  error: unknown
): Record<string, string | undefined> | undefined => {
  if (error instanceof ValidationError) {
    return error.errors;
  }

  if (error instanceof z.ZodError) {
    const tree = z.treeifyError(error) as TreeNode;
    return treeToFieldErrors(tree);
  }

  return undefined;
};

export const getErrorMetadata = (error: unknown): ErrorMetadata => {
  if (error instanceof ConflictError) {
    return { code: ERROR_CODES.CONFLICT, status: 409, isTrusted: true };
  }

  if (error instanceof NotFoundError) {
    return { code: ERROR_CODES.NOT_FOUND, status: 404, isTrusted: true };
  }

  if (error instanceof DomainValidationError) {
    return {
      code: ERROR_CODES.DOMAIN_VALIDATION,
      status: 400,
      isTrusted: true,
    };
  }

  if (error instanceof ValidationError || error instanceof z.ZodError) {
    return { code: ERROR_CODES.VALIDATION, status: 400, isTrusted: true };
  }

  if (error instanceof AuthError) {
    return { code: ERROR_CODES.AUTH, status: 401, isTrusted: true };
  }

  if (error instanceof DatasourceError) {
    return { code: ERROR_CODES.DATASOURCE, status: 500, isTrusted: true };
  }

  return {
    code: ERROR_CODES.INTERNAL_SERVER_ERROR,
    status: 500,
    isTrusted: false,
  };
};
