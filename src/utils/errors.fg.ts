export class AppError extends Error {
  readonly statusCode: number;
  readonly details?: unknown;
  readonly expose: boolean;

  constructor(statusCode: number, message: string, options?: { expose?: boolean; details?: unknown }) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = options?.details;
    this.expose = options?.expose ?? statusCode < 500;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not Found') {
    super(404, message);
  }
}

export const isAppError = (error: unknown): error is AppError => error instanceof AppError;

