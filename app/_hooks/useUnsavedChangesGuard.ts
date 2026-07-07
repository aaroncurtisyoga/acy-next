"use client";

import { useCallback, useEffect, useRef } from "react";

const LEAVE_MESSAGE = "You have unsaved changes. Leave without saving?";

interface GuardOptions {
  /**
   * How to complete a Back-button departure once the guard has intercepted it.
   * Runs both when the user confirms leaving unsaved work and when they Back
   * out of an already-saved draft. Should be a same-document navigation to a
   * safe destination, e.g. () => router.replace("/admin/newsletter"). Using
   * the router (rather than history.back()) keeps this race-free — history
   * traversal can't tell a first-entry no-op from a slow cross-document load.
   */
  onLeave?: () => void;
}

interface GuardControls {
  /**
   * Swap the current URL (e.g. /create → /{id}) while keeping any active
   * Back/Forward sentinel consistent. Use instead of window.history.replaceState.
   *
   * Note: replaceState can only rewrite the current (top) entry, so on /create
   * the entry *beneath* an active sentinel keeps its /create URL. That stale
   * entry is replaced away on a Back-and-leave, but can resurface as a blank
   * form if you send a brand-new newsletter immediately after its first
   * autosave and then press Back, or via the Forward button after leaving —
   * harmless, no data loss. The History API offers no way to rewrite (or prune)
   * a non-top / forward entry without a jarring flicker or an added entry.
   */
  replaceGuardedUrl: (href: string) => void;
  /**
   * Call right before a deliberate programmatic navigation (e.g. after send).
   * Returns true when a sentinel is currently on top of the history stack, in
   * which case the caller should use router.replace (which consumes it) rather
   * than router.push (which would leave a duplicate entry behind).
   */
  releaseForNavigation: () => boolean;
}

/**
 * Warns before losing unsaved work across every way out of the page:
 * - a native `beforeunload` prompt covers tab closes and hard reloads;
 * - a capture-phase click listener covers in-app link navigation (the App
 *   Router has no route-change blocking API);
 * - a history "sentinel" entry covers the browser Back/Forward buttons, which
 *   the App Router handles as a client-side `popstate` that fires neither of
 *   the above.
 *
 * The Back/Forward interception pushes a duplicate history entry while there
 * are unsaved changes. The first Back press pops that duplicate and fires
 * `popstate` — our chance to confirm: decline and we re-push the sentinel (at
 * the *canonical* URL, so an autosave that swapped /create → /{id} underneath
 * us doesn't corrupt the address bar); accept (or the draft was already saved)
 * and we complete the departure via `onLeave`.
 */
export function useUnsavedChangesGuard(
  hasUnsavedChanges: boolean,
  options: GuardOptions = {},
): GuardControls {
  // Read the freshest values inside listeners that outlive a single render.
  // Synced in an effect (not during render) per the react-hooks rules; the
  // listeners read these at event time, always after the latest commit.
  const hasUnsavedRef = useRef(hasUnsavedChanges);
  const optionsRef = useRef(options);
  useEffect(() => {
    hasUnsavedRef.current = hasUnsavedChanges;
    optionsRef.current = options;
  });

  // Whether our duplicate entry is currently on top of the stack.
  const sentinelActiveRef = useRef(false);
  // The URL the page should show. Kept in sync when the composer swaps it, so a
  // re-pushed sentinel never inherits a stale URL from the entry beneath it.
  const canonicalHrefRef = useRef<string | null>(null);

  const pushSentinel = useCallback(() => {
    const href = canonicalHrefRef.current ?? window.location.href;
    // Spread the current state so Next's history bookkeeping (route tree)
    // isn't wiped; Next's patched pushState augments it further.
    window.history.pushState(
      { ...(window.history.state || {}), __acyUnsavedGuard: true },
      "",
      href,
    );
    sentinelActiveRef.current = true;
  }, []);

  // beforeunload + in-app link clicks.
  useEffect(() => {
    if (!hasUnsavedChanges) return undefined;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Chrome ignores preventDefault alone; returnValue triggers the prompt
      event.returnValue = "";
    };

    const handleClickCapture = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return; // new-tab / download modifiers don't navigate this page
      }
      const anchor = (event.target as HTMLElement | null)?.closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank") return;
      // Links inside the rich-text editor just place the caret — they never
      // navigate, so confirming would be a false alarm.
      if (anchor.closest('[contenteditable="true"], .ProseMirror')) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      const url = new URL(href, window.location.href);
      // Cross-origin navigation unloads the page — beforeunload handles it
      if (url.origin !== window.location.origin) return;
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        return;
      }
      if (!window.confirm(LEAVE_MESSAGE)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleClickCapture, true);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleClickCapture, true);
    };
  }, [hasUnsavedChanges]);

  // Browser Back/Forward interception. Mounts once and reads refs, so it
  // survives the frequent activate/deactivate cycles autosave causes without
  // ever calling history.back() on cleanup (which would navigate the user away
  // every time a draft finishes saving).
  useEffect(() => {
    canonicalHrefRef.current = window.location.href;

    const onPopState = () => {
      const hadSentinel = sentinelActiveRef.current;
      sentinelActiveRef.current = false;
      // A popstate with no sentinel of ours in play is a navigation we weren't
      // guarding — it has already happened, so leave it alone.
      if (!hadSentinel) return;

      if (hasUnsavedRef.current && !window.confirm(LEAVE_MESSAGE)) {
        // Stay: re-arm the sentinel at the canonical URL (not whatever stale
        // entry we just popped onto).
        pushSentinel();
        return;
      }

      // Leave — either the user confirmed, or the draft was already saved and
      // the sentinel just lingered. The Back already popped the sentinel; finish
      // the departure with a same-document router navigation (race-free, unlike
      // history.back(), which can't distinguish a first-entry no-op from a slow
      // cross-document traversal). Fall back to history.back() only when no
      // handler was supplied.
      if (optionsRef.current.onLeave) {
        optionsRef.current.onLeave();
      } else {
        window.history.back();
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [pushSentinel]);

  // Arm the sentinel the moment unsaved changes appear (once — a sentinel that
  // survived from an earlier edit is reused rather than duplicated).
  useEffect(() => {
    if (hasUnsavedChanges && !sentinelActiveRef.current) {
      pushSentinel();
    }
  }, [hasUnsavedChanges, pushSentinel]);

  const replaceGuardedUrl = useCallback((href: string) => {
    canonicalHrefRef.current = href;
    // Preserve Next's history state (route tree) rather than nulling it.
    window.history.replaceState(window.history.state, "", href);
  }, []);

  const releaseForNavigation = useCallback(() => {
    const wasArmed = sentinelActiveRef.current;
    sentinelActiveRef.current = false;
    return wasArmed;
  }, []);

  return { replaceGuardedUrl, releaseForNavigation };
}
