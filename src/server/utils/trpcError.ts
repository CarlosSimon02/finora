import {
  ERROR_CODES,
  getErrorMetadata,
  getValidationErrors,
  type MappedErrorCode,
} from "@/utils";
import { TRPCError } from "@trpc/server";

type ErrorMetadata = {
  code: MappedErrorCode;
};

export class TRPCErrorMapper {
  static toTRPCError(error: unknown): TRPCError {
    if (error instanceof TRPCError) return error;

    const metadata: ErrorMetadata = getErrorMetadata(error);
    const trpcCode: MappedErrorCode =
      ERROR_CODES[metadata.code as keyof typeof ERROR_CODES] ||
      "INTERNAL_SERVER_ERROR";
    const message =
      error instanceof Error ? error.message : "An error occurred";

    return new TRPCError({
      code: trpcCode,
      message,
      cause: error,
    });
  }
}

export const createErrorFormatter = () => {
  return ({ shape, error }: { shape: any; error: any }) => {
    const validationErrors = getValidationErrors(error.cause);

    return {
      ...shape,
      data: {
        ...shape.data,
        validationErrors,
      },
    };
  };
};
