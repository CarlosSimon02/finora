type ErrorContext = {
  path: string;
  type: string;
  duration: number;
};

type ExtendedError = Error & {
  originalError?: Error;
  cause?: unknown;
};

export class TRPCLogger {
  private static readonly SEPARATOR = "=".repeat(80);
  private static enabled: boolean = TRPCLogger.computeEnabled();

  private static computeEnabled(): boolean {
    if (typeof process !== "undefined" && process.env && process.env.NODE_ENV) {
      return process.env.NODE_ENV !== "production";
    }
    return true;
  }

  static enable(): void {
    TRPCLogger.enabled = true;
  }

  static disable(): void {
    TRPCLogger.enabled = false;
  }

  private static guard(): boolean {
    return TRPCLogger.enabled;
  }

  static info(message: string): void {
    if (!this.guard()) return;
    console.log(`[INFO] ${message}`);
  }

  static error(message: string): void {
    if (!this.guard()) return;
    console.error(`[ERROR] ${message}`);
  }

  static logProcedureStart(type: string, path: string): void {
    if (!this.guard()) return;
    this.info(`[TRPC] ${type.toUpperCase()} ${path} - Started`);
  }

  static logProcedureSuccess(
    type: string,
    path: string,
    duration: number
  ): void {
    if (!this.guard()) return;
    this.info(`[TRPC] ${type.toUpperCase()} ${path} - Success (${duration}ms)`);
  }

  static logError(error: unknown, context: ErrorContext): void {
    if (!this.guard()) return;

    this.logSeparator();
    this.error("❌ TRPC ERROR CAUGHT IN MIDDLEWARE");
    this.logSeparator();

    this.error(`Procedure: ${context.path}`);
    this.error(`Type: ${context.type}`);
    this.error(`Duration: ${context.duration}ms`);
    this.error(`Timestamp: ${new Date().toISOString()}`);
    this.logSeparator();

    this.logErrorDetails(error);
    this.logFirestoreIndexWarning(error);

    this.logSeparator();
    this.error("");
  }

  private static logSeparator(): void {
    if (!this.guard()) return;
    this.error(this.SEPARATOR);
  }

  private static logErrorDetails(error: unknown): void {
    if (!this.guard()) return;

    if (error instanceof Error) {
      const extendedError = error as ExtendedError;
      this.error(`Error Name: ${error.name}`);
      this.error(`Error Message: ${error.message}`);
      this.error(`Stack Trace:`);
      this.error(error.stack || "No stack trace available");

      this.logOriginalError(extendedError);
      this.logErrorCause(extendedError);
    } else {
      const safeValue = (() => {
        try {
          return JSON.stringify(error, null, 2);
        } catch {
          return String(error);
        }
      })();

      this.error(`Unknown Error Type: ${typeof error}`);
      this.error(`Error Value: ${safeValue}`);
    }
  }

  private static logOriginalError(error: ExtendedError): void {
    if (!this.guard()) return;
    if (!error.originalError) return;

    this.error(`\n📍 Original Error (unwrapped):`);
    this.error(`  Name: ${error.originalError.name}`);
    this.error(`  Message: ${error.originalError.message}`);
    if (error.originalError.stack) {
      this.error(`  Stack: ${error.originalError.stack}`);
    }
  }

  private static logErrorCause(error: ExtendedError): void {
    if (!this.guard()) return;
    if (!error.cause) return;

    this.error(`\n📎 Error Cause:`);
    if (error.cause instanceof Error) {
      this.error(`  Name: ${error.cause.name}`);
      this.error(`  Message: ${error.cause.message}`);
      if (error.cause.stack) {
        this.error(`  Stack: ${error.cause.stack}`);
      }
    } else {
      try {
        this.error(JSON.stringify(error.cause, null, 2));
      } catch {
        this.error(String(error.cause));
      }
    }
  }

  private static logFirestoreIndexWarning(error: unknown): void {
    if (!this.guard()) return;

    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes("index")) {
      this.error("\n" + "⚠️".repeat(40));
      this.error("⚠️  FIRESTORE INDEX REQUIRED!");
      this.error("⚠️  This query requires a composite index.");
      this.error("⚠️  Look for the URL in the error message above.");
      this.error("⚠️  Click the URL to create the index automatically.");
      this.error("⚠️".repeat(40));
    }
  }
}
