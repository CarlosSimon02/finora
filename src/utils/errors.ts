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
  constructor(message: string = "Datasource operation failed") {
    super(message);
    this.name = "DatasourceError";
  }
}

export class AuthError extends Error {
  constructor(message: string = "Authentication failed") {
    super(message);
    this.name = "AuthError";
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
