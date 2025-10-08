export class ConflictError extends Error {
  constructor(message: string = "Resource already exists") {
    super(message);
    this.name = "ConflictError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class DomainValidationError extends Error {
  constructor(message: string = "Domain validation failed") {
    super(message);
    this.name = "DomainValidationError";
  }
}

export class DatasourceError extends Error {
  cause?: unknown;
  originalError?: Error;

  constructor(
    message: string = "Datasource operation failed",
    cause?: unknown
  ) {
    super(message);
    this.name = "DatasourceError";
    this.cause = cause;
    if (cause instanceof Error) {
      this.originalError = cause;
      // Preserve the original stack trace
      this.stack = cause.stack;
    }
  }
}

export class AuthError extends Error {
  constructor(message: string = "Authentication failed") {
    super(message);
    this.name = "AuthError";
  }
}

export class ModelValidationError extends Error {
  details?: string;
  constructor(message: string = "Model validation failed", details?: string) {
    super(message);
    this.name = "ModelValidationError";
    this.details = details;
  }
}

export class ValidationError extends Error {
  errors: Record<string, string | undefined>;

  constructor(errors: Record<string, string | undefined>, message: string) {
    super(message || "An validation error occured");
    this.errors = errors;
  }

  getErrors() {
    return this.errors;
  }
}
