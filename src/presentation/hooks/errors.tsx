import { useCallback } from "react";
import { toast } from "sonner";

export type ErrorHandlerOptions = {
  onError?: (error: Error) => void;
  fallbackMessage?: string;
};

export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const { onError, fallbackMessage = "Something went wrong" } = options;

  const handleError = useCallback(
    (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : fallbackMessage;

      toast.error(message);
      onError?.(error as Error);
    },
    [fallbackMessage, onError]
  );

  return handleError;
};
