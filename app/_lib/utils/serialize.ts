/**
 * The shape `serialize()` actually returns: a deep copy in which every `Date`
 * has become its ISO `string`, mirroring the JSON round-trip's real runtime
 * behavior. Making this explicit stops `event.startDateTime.getTime()` from
 * type-checking against a value that is really a string.
 */
export type Serialized<T> = T extends Date
  ? string
  : T extends (infer U)[]
    ? Serialized<U>[]
    : T extends object
      ? { [K in keyof T]: Serialized<T[K]> }
      : T;

/**
 * Converts Prisma objects to plain JavaScript objects.
 *
 * Prisma objects contain internal properties (like Symbol.toStringTag) that
 * cannot be serialized when passed from server actions to client components.
 * This utility strips those properties by round-tripping through JSON.
 *
 * Returns `Serialized<T>`: Date fields become ISO strings (see the type above).
 */
export function serialize<T>(data: T): Serialized<T> {
  return JSON.parse(JSON.stringify(data));
}
