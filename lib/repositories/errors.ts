/**
 * Base error type for repository operations
 */
export class RepositoryError extends Error {
  code?: string;
  originalError?: unknown;

  constructor(
    message: string,
    options?: { code?: string; originalError?: unknown },
  ) {
    super(message);
    this.name = "RepositoryError";
    this.code = options?.code;
    this.originalError = options?.originalError;
  }
}
