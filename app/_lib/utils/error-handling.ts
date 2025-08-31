export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public field?: string,
  ) {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(`Database error: ${message}`, 500);
  }
}

export function handleError(error: unknown, context?: string): never {
  if (process.env.NODE_ENV === "development") {
    console.error(`Error ${context ? `in ${context}` : ""}:`, error);
  }

  if (error instanceof AppError) {
    throw error;
  }

  if (error instanceof Error) {
    throw new AppError(error.message);
  }

  throw new AppError("An unexpected error occurred");
}

export function logError(error: unknown, context?: string): void {
  if (process.env.NODE_ENV === "development") {
    console.error(`Error ${context ? `in ${context}` : ""}:`, {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
  }
  // In production, you should send this to a proper logging service
  // Example: sendToLoggingService(error, context);
}

export function isOperationalError(error: Error): boolean {
  return error instanceof AppError && error.isOperational;
}
