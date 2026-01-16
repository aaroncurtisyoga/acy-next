/**
 * Converts Prisma objects to plain JavaScript objects.
 *
 * Prisma objects contain internal properties (like Symbol.toStringTag) that
 * cannot be serialized when passed from server actions to client components.
 * This utility strips those properties by round-tripping through JSON.
 *
 * Note: Date objects will be converted to ISO strings.
 */
export function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}
