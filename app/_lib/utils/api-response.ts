import { NextResponse } from "next/server";
import { AppError, logError } from "./error-handling";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = 200,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}

export function createErrorResponse(
  error: unknown,
  context?: string,
  fallbackStatus: number = 500,
): NextResponse<ApiResponse> {
  logError(error, context);

  let status = fallbackStatus;
  let message = "An unexpected error occurred";

  if (error instanceof AppError) {
    status = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return NextResponse.json(
    {
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}

export async function withErrorHandling<T>(
  handler: () => Promise<T>,
  context?: string,
): Promise<NextResponse<ApiResponse<T>>> {
  try {
    const data = await handler();
    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse(error, context);
  }
}
