export interface RetryOptions {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  retryCondition?: (error: any) => boolean;
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions,
): Promise<T> {
  const { maxAttempts, baseDelay, maxDelay, retryCondition } = options;

  let lastError: any;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Check if we should retry this error
      if (retryCondition && !retryCondition(error)) {
        throw error;
      }

      // Don't retry on the last attempt
      if (attempt === maxAttempts) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);

      console.log(
        `Attempt ${attempt} failed, retrying in ${delay}ms...`,
        error.message,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

export function isBrowserlessRateLimit(error: any): boolean {
  const errorMessage = error?.message || "";
  return (
    errorMessage.includes("429 Too Many Requests") ||
    errorMessage.includes("WebSocket error") ||
    errorMessage.includes("Too Many Requests")
  );
}
