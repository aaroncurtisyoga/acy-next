import { ValidationError } from "./error-handling";

export function validateRequired<T>(
  value: T,
  fieldName: string,
): asserts value is NonNullable<T> {
  if (value === null || value === undefined || value === "") {
    throw new ValidationError(`${fieldName} is required`, fieldName);
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePrice(price: string): boolean {
  const num = parseFloat(price);
  return !isNaN(num) && num >= 0;
}

export function validateDateRange(startDate: Date, endDate: Date): boolean {
  return startDate < endDate;
}

export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}

export function validateStringLength(
  value: string,
  fieldName: string,
  minLength: number = 1,
  maxLength: number = 1000,
): void {
  if (value.length < minLength) {
    throw new ValidationError(
      `${fieldName} must be at least ${minLength} characters long`,
      fieldName,
    );
  }
  if (value.length > maxLength) {
    throw new ValidationError(
      `${fieldName} must be no more than ${maxLength} characters long`,
      fieldName,
    );
  }
}
