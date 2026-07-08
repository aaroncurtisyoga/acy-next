/**
 * Shared cache tags for `unstable_cache` / `revalidateTag`. Kept in a neutral
 * module (not the "use server" actions file, which may only export async
 * functions, and not event.queries.ts, which would create an import cycle) so
 * both the cached readers and the mutating actions can reference the same tag.
 */
export const EVENTS_CACHE_TAG = "events";
