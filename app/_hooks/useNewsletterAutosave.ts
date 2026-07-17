"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useWatch,
  type Control,
  type UseFormGetValues,
  type UseFormReset,
} from "react-hook-form";
import { z } from "zod";
import { Newsletter } from "@prisma/client";
import { useUnsavedChangesGuard } from "@/app/_hooks/useUnsavedChangesGuard";
import {
  createNewsletter,
  updateNewsletter,
} from "@/app/_lib/actions/newsletter.actions";
import { NewsletterComposeSchema } from "@/app/_lib/schema";
import { formatDateTime } from "@/app/_lib/utils";

type ComposeInputs = z.infer<typeof NewsletterComposeSchema>;

const AUTOSAVE_DELAY_MS = 2000;

interface UseNewsletterAutosaveParams {
  newsletter?: Newsletter;
  control: Control<ComposeInputs>;
  getValues: UseFormGetValues<ComposeInputs>;
  reset: UseFormReset<ComposeInputs>;
  isDirty: boolean;
  isSubmitting: boolean;
  isSending: boolean;
  // Complete an intercepted Back-button leave (e.g. router.replace to the list).
  onLeaveNavigate: () => void;
}

/**
 * Owns the newsletter composer's draft persistence: debounced autosave, the
 * one-save-at-a-time queue, the create-then-swap-URL flow, and the unsaved-
 * changes navigation guard.
 *
 * These pieces are extracted together (rather than left scattered through the
 * 1000-line editor) because they share a web of refs and a circular link with
 * the guard: the guard blocks navigation while `saveState === "saving"`, and
 * `doPersist` in turn calls the guard's `replaceGuardedUrl`. Keeping the guard
 * call inside the hook resolves that ordering cleanly.
 *
 * The component keeps its form and UI; it drives this hook with the form's
 * `control`/`getValues`/`reset` and the busy flags, and consumes `saveState`,
 * `persistDraft`, etc. back.
 */
export function useNewsletterAutosave({
  newsletter,
  control,
  getValues,
  reset,
  isDirty,
  isSubmitting,
  isSending,
  onLeaveNavigate,
}: UseNewsletterAutosaveParams) {
  // The row this composer is editing. Starts null on /create — the first
  // (auto)save creates it and swaps the URL in place via history.replaceState,
  // deliberately NOT router.replace, which would remount the page mid-typing.
  const newsletterIdRef = useRef<string | null>(newsletter?.id ?? null);
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >(newsletter ? "saved" : "idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(
    newsletter ? new Date(newsletter.updatedAt) : null,
  );
  const saveInFlightRef = useRef(false);
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // A resolved save must not rewrite the URL or reschedule itself after the
  // user has navigated away (the save request can outlive the composer).
  const isMountedRef = useRef(true);
  const busyRef = useRef(false);

  // Guard unsaved work across links, reload, and browser Back/Forward.
  // Set once a Back-button leave has been confirmed, so an autosave that
  // resolves mid-departure doesn't swap the URL out from under router.replace.
  const leavingRef = useRef(false);
  const { replaceGuardedUrl, releaseForNavigation } = useUnsavedChangesGuard(
    isDirty || saveState === "saving",
    // Complete an intercepted Back by replacing the editor entry with the list,
    // so the user lands there and can't Back straight into the abandoned draft.
    {
      onLeave: () => {
        leavingRef.current = true;
        onLeaveNavigate();
      },
    },
  );

  /**
   * Persist the draft (creating the row on first save) and clear the form's
   * dirty flag without touching field values, so the Tiptap cursor is never
   * disturbed. Returns the saved row or null.
   */
  const doPersist = useCallback(
    async (data: ComposeInputs, opts?: { revalidate?: boolean }) => {
      const id = newsletterIdRef.current;
      const result = id
        ? await updateNewsletter(id, data, opts)
        : await createNewsletter(data, opts);

      if (!result.status || !result.data) {
        return { saved: null, message: result.message };
      }
      if (!id) {
        newsletterIdRef.current = result.data.id;
        // Only rewrite the URL if we're still the active page and not already
        // leaving — the user may have confirmed the leave prompt while this
        // request was in flight, and swapping the URL now would race the
        // router.replace departure. Route through the guard so a live
        // Back/Forward sentinel stays in sync with the new /{id} URL.
        if (isMountedRef.current && !leavingRef.current) {
          replaceGuardedUrl(`/admin/newsletter/${result.data.id}`);
        }
      }
      if (isMountedRef.current) {
        reset(data, { keepValues: true });
        setSaveState("saved");
        setLastSavedAt(new Date());
      }
      return { saved: result.data, message: undefined };
    },
    [reset, replaceGuardedUrl],
  );

  // All saves run through one queue: a manual Save/Send that lands while an
  // autosave create is still in flight must wait for it, or /create would
  // mint two rows (newsletterIdRef is only set once the create resolves).
  const persistQueueRef = useRef<Promise<unknown>>(Promise.resolve());
  const persistDraft = useCallback(
    (data: ComposeInputs, opts?: { revalidate?: boolean }) => {
      const run = () => doPersist(data, opts);
      const next = persistQueueRef.current.then(run, run);
      persistQueueRef.current = next.catch(() => undefined);
      return next;
    },
    [doPersist],
  );

  const cancelPendingAutosave = useCallback(() => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = null;
    }
  }, []);

  const runAutosave = useCallback(async () => {
    if (!isMountedRef.current || saveInFlightRef.current) return;
    const values = getValues();
    // Autosave only fires once the draft is valid (a subject and a real body);
    // until then there's nothing worth a row in the database.
    if (!NewsletterComposeSchema.safeParse(values).success) return;

    saveInFlightRef.current = true;
    setSaveState("saving");
    try {
      const { saved } = await persistDraft(values, { revalidate: false });
      if (!saved) {
        if (isMountedRef.current) setSaveState("error");
        return;
      }
    } catch {
      if (isMountedRef.current) setSaveState("error");
      return;
    } finally {
      saveInFlightRef.current = false;
    }

    // Edits that landed while the save was in flight get their own pass —
    // unless the composer unmounted (don't save work the user chose to
    // abandon) or a manual save/send has taken over.
    if (
      isMountedRef.current &&
      !busyRef.current &&
      JSON.stringify(getValues()) !== JSON.stringify(values)
    ) {
      cancelPendingAutosave();
      autosaveTimerRef.current = setTimeout(
        () => void runAutosave(),
        AUTOSAVE_DELAY_MS,
      );
    }
  }, [getValues, persistDraft, cancelPendingAutosave]);

  // Debounced autosave: any form change (while editable and dirty) schedules a
  // save 2s after the last keystroke.
  const watchedValues = useWatch({ control });
  useEffect(() => {
    if (!isDirty || isSubmitting || isSending) return undefined;
    if (!NewsletterComposeSchema.safeParse(getValues()).success) {
      return undefined;
    }

    cancelPendingAutosave();
    autosaveTimerRef.current = setTimeout(
      () => void runAutosave(),
      AUTOSAVE_DELAY_MS,
    );
    return cancelPendingAutosave;
  }, [
    watchedValues,
    isDirty,
    isSubmitting,
    isSending,
    getValues,
    runAutosave,
    cancelPendingAutosave,
  ]);

  // Mirror the busy flags into a ref for the autosave tail (which runs after
  // awaits, where state would be stale), and track mount for the same reason.
  busyRef.current = isSubmitting || isSending;
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, []);

  // Autosave only runs on a valid draft, so surface the distinction: without
  // this, clearing the subject would silently stop autosave while the header
  // still read "Saved".
  const isDraftValid = useMemo(
    () => NewsletterComposeSchema.safeParse(watchedValues).success,
    [watchedValues],
  );

  // Re-render every 30s so "Saved · Xm ago" doesn't go stale.
  const [, setAgeTick] = useState(0);
  useEffect(() => {
    if (!lastSavedAt) return undefined;
    const timer = setInterval(() => setAgeTick((n) => n + 1), 30_000);
    return () => clearInterval(timer);
  }, [lastSavedAt]);

  const savedAgoLabel = (() => {
    if (!lastSavedAt) return "";
    const seconds = (Date.now() - lastSavedAt.getTime()) / 1000;
    if (seconds < 45) return "just now";
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    // Beyond a day, a bare time-of-day would read as "today" — show the date.
    if (seconds < 24 * 3600) return formatDateTime(lastSavedAt).timeOnly;
    return formatDateTime(lastSavedAt).dateTime;
  })();

  return {
    saveState,
    setSaveState,
    lastSavedAt,
    savedAgoLabel,
    isDraftValid,
    persistDraft,
    cancelPendingAutosave,
    releaseForNavigation,
  };
}
