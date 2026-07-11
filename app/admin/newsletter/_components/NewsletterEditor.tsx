"use client";

import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Newsletter } from "@prisma/client";
import { Editor } from "@tiptap/react";
import { toast } from "sonner";
import {
  CalendarClock,
  CalendarPlus,
  ChevronDown,
  Eye,
  Loader2,
  Save,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Tiptap from "@/app/_components/Tiptap";
import { EmojiPickerPopover } from "@/app/_components/Tiptap/EmojiPicker";
import { useUnsavedChangesGuard } from "@/app/_hooks/useUnsavedChangesGuard";
import {
  findNewsletterContentIssues,
  renderNewsletterHtml,
  resolveMergeTags,
} from "@/app/_lib/email/newsletter-template";
import {
  createNewsletter,
  getNewsletterEventSectionsHtml,
  getSubscriberCount,
  sendNewsletter,
  sendTestNewsletter,
  updateNewsletter,
} from "@/app/_lib/actions/newsletter.actions";
import {
  NEWSLETTER_SCHEDULE_MAX_DAYS,
  NewsletterComposeSchema,
} from "@/app/_lib/schema";
import { formatDateTime } from "@/app/_lib/utils";
import InsertEventDialog from "@/app/admin/newsletter/_components/InsertEventDialog";
import {
  SNIPPETS,
  STARTER_TEMPLATE_HTML,
} from "@/app/admin/newsletter/_lib/templates";

type ComposeInputs = z.infer<typeof NewsletterComposeSchema>;

const LIVE_PREVIEW_KEY = "acy:newsletter:live-preview";
const AUTOSAVE_DELAY_MS = 2000;
const SUBJECT_MAX = 150;

interface NewsletterEditorProps {
  newsletter?: Newsletter;
}

const NewsletterEditor: FC<NewsletterEditorProps> = ({ newsletter }) => {
  const router = useRouter();
  const editorRef = useRef<Editor | null>(null);
  const subjectInputRef = useRef<HTMLInputElement | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>();
  const [isSending, setIsSending] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  // Live "Upcoming" + "Classes This Week" HTML, appended after the message.
  const [sectionsHtml, setSectionsHtml] = useState("");
  // Live-preview mode renders the email beside the editor as you type.
  const [livePreview, setLivePreview] = useState(true);
  // Shown in the Send dialog so "send to all subscribers" has a number on it.
  const [subscriberCount, setSubscriberCount] = useState<{
    count: number;
    hasMore: boolean;
  } | null>(null);

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

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    trigger,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ComposeInputs>({
    resolver: zodResolver(NewsletterComposeSchema),
    defaultValues: {
      subject: newsletter?.subject ?? "",
      previewText: newsletter?.previewText ?? "",
      // A new newsletter opens with the greeting/sign-off skeleton instead of
      // a blank page.
      content: newsletter?.content ?? STARTER_TEMPLATE_HTML,
      includeUpcoming: newsletter?.includeUpcoming ?? true,
      includeClasses: newsletter?.includeClasses ?? true,
      includeDescriptions: newsletter?.includeDescriptions ?? false,
    },
  });

  const handleEditorReady = useCallback((editor: Editor) => {
    editorRef.current = editor;
  }, []);

  // Guard unsaved work across links, reload, and browser Back/Forward. Called
  // here (above doPersist) so its history helpers are available to the save
  // and send paths.
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
        router.replace("/admin/newsletter");
      },
    },
  );

  const includeUpcoming = useWatch({ control, name: "includeUpcoming" });
  const includeClasses = useWatch({ control, name: "includeClasses" });
  const includeDescriptions = useWatch({
    control,
    name: "includeDescriptions",
  });
  const subjectValue = useWatch({ control, name: "subject" }) ?? "";
  const previewTextValue = useWatch({ control, name: "previewText" }) ?? "";

  // Pull the same listings that get appended at send time so Preview matches.
  useEffect(() => {
    let active = true;
    const loadSections = async () => {
      try {
        const html = await getNewsletterEventSectionsHtml({
          includeUpcoming,
          includeClasses,
          includeDescriptions,
        });
        if (active) setSectionsHtml(html);
      } catch {
        // Preview just omits the event sections until the next toggle change.
      }
    };
    loadSections();
    return () => {
      active = false;
    };
  }, [includeUpcoming, includeClasses, includeDescriptions]);

  // Restore the live-preview choice for this browser (defaults on).
  useEffect(() => {
    if (window.localStorage.getItem(LIVE_PREVIEW_KEY) === "false") {
      setLivePreview(false);
    }
  }, []);

  const toggleLivePreview = (next: boolean) => {
    setLivePreview(next);
    window.localStorage.setItem(LIVE_PREVIEW_KEY, String(next));
  };

  // Watch the fields shown in the email and debounce them so the live preview
  // refreshes shortly after you pause typing rather than on every keystroke.
  const watchedContent = useWatch({ control, name: "content" });
  const [debounced, setDebounced] = useState({
    content: newsletter?.content ?? "",
    previewText: newsletter?.previewText ?? "",
  });
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced({
        content: watchedContent ?? "",
        previewText: previewTextValue,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [watchedContent, previewTextValue]);

  // Pre-flight check shown in the Send dialog: template placeholders and
  // broken merge tags block the send (the server refuses them too); other
  // bracketed text is a "did you mean to leave this in?" warning.
  const contentIssues = useMemo(
    () =>
      isSendOpen
        ? findNewsletterContentIssues(getValues("content") ?? "")
        : { blockers: [], warnings: [] },
    // getValues is stable; re-check whenever the dialog opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSendOpen],
  );

  const livePreviewSrcDoc = useMemo(
    () =>
      livePreview
        ? renderNewsletterHtml({
            contentHtml: `${resolveMergeTags(
              debounced.content || "<p>Start writing…</p>",
            )}${sectionsHtml}`,
            previewText: debounced.previewText,
            unsubscribeUrl: "#",
          })
        : "",
    [livePreview, debounced, sectionsHtml],
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

  // Fetch the audience size when the Send dialog opens.
  useEffect(() => {
    if (!isSendOpen) return undefined;
    let active = true;
    setSubscriberCount(null);
    getSubscriberCount()
      .then((result) => {
        if (active && result) {
          setSubscriberCount({ count: result.count, hasMore: result.hasMore });
        }
      })
      .catch(() => {
        // Dialog copy falls back to "all subscribers" — no number, no crash.
      });
    return () => {
      active = false;
    };
  }, [isSendOpen]);

  const onSaveDraft = async (data: ComposeInputs) => {
    cancelPendingAutosave();
    try {
      const { saved, message } = await persistDraft(data);
      if (!saved) {
        setSaveState("error");
        toast.error(message ?? "Failed to save the draft.");
        return;
      }
      toast.success("Draft saved");
    } catch {
      // A rejected server action (expired session, network drop) otherwise
      // fails with no feedback at all.
      setSaveState("error");
      toast.error("Couldn't reach the server — check your connection.");
    }
  };

  const handleSendTest = async () => {
    if (!(await trigger())) return;
    setIsTesting(true);
    try {
      const result = await sendTestNewsletter(getValues());
      if (result.status) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Couldn't reach the server — check your connection.");
    } finally {
      setIsTesting(false);
    }
  };

  const insertAtCursor = (html: string) => {
    editorRef.current?.chain().focus().insertContent(html).run();
  };

  const handleInsertGreeting = () => {
    // Resend swaps {{{contact.first_name}}} for each person's name at send
    // time — greetings belong at the very top, so insert at the start.
    editorRef.current
      ?.chain()
      .focus("start")
      .insertContent("<p>Hey {{{contact.first_name}}}</p>")
      .run();
  };

  // The calendar can only disable whole days, so a time later on the 30th day
  // still gets through it — this minute-level check drives the Schedule
  // button and inline error instead of a dead-end toast.
  const scheduleTooFar =
    !!scheduledAt &&
    scheduledAt.getTime() >
      Date.now() + NEWSLETTER_SCHEDULE_MAX_DAYS * 24 * 60 * 60 * 1000;

  const handleSend = async (when: "now" | "scheduled") => {
    if (when === "scheduled") {
      if (!scheduledAt) {
        toast.error("Pick a date and time first.");
        return;
      }
      if (scheduledAt <= new Date()) {
        toast.error("The scheduled time must be in the future.");
        return;
      }
      const maxSchedule = new Date(
        Date.now() + NEWSLETTER_SCHEDULE_MAX_DAYS * 24 * 60 * 60 * 1000,
      );
      if (scheduledAt > maxSchedule) {
        toast.error(
          `Resend can schedule up to ${NEWSLETTER_SCHEDULE_MAX_DAYS} days ahead — pick an earlier time.`,
        );
        return;
      }
    }

    cancelPendingAutosave();
    setIsSending(true);
    try {
      // The broadcast is built from the saved row (content and section
      // toggles), so persist edits first.
      const { saved, message } = await persistDraft(getValues());
      if (!saved) {
        toast.error(message ?? "Failed to save the draft.");
        return;
      }

      const result = await sendNewsletter(
        saved.id,
        when === "scheduled" ? scheduledAt!.toISOString() : undefined,
      );
      if (!result.status) {
        toast.error(result.message);
        return;
      }

      toast.success(
        when === "scheduled"
          ? `Scheduled for ${formatDateTime(scheduledAt!).dateTime}`
          : "Newsletter sent!",
      );
      // Consume the Back/Forward sentinel (if one is armed) by replacing it
      // rather than pushing a new entry over it, so we don't leave a duplicate
      // /{id} entry the user would have to Back past twice.
      if (releaseForNavigation()) {
        router.replace("/admin/newsletter");
      } else {
        router.push("/admin/newsletter");
      }
    } catch {
      toast.error(
        "Couldn't reach the server — nothing was sent. Check your connection and try again.",
      );
    } finally {
      setIsSending(false);
    }
  };

  const previewHtml = () =>
    renderNewsletterHtml({
      // Resolve the greeting to its no-name form and append the same event
      // listings that get added at send time, so Preview matches the real email.
      contentHtml: `${resolveMergeTags(
        getValues("content") || "<p>Nothing here yet…</p>",
      )}${sectionsHtml}`,
      previewText: getValues("previewText"),
      unsubscribeUrl: "#",
    });

  const insertSubjectEmoji = (char: string) => {
    const input = subjectInputRef.current;
    const current = getValues("subject") ?? "";
    // A never-focused input reports selection 0/0 — "add an emoji to my
    // subject" means append in that case, not prepend.
    const hasCaret = input && document.activeElement === input;
    const start = (hasCaret ? input.selectionStart : null) ?? current.length;
    const end = (hasCaret ? input.selectionEnd : null) ?? current.length;
    setValue("subject", current.slice(0, start) + char + current.slice(end), {
      shouldDirty: true,
      shouldValidate: true,
    });
    requestAnimationFrame(() => {
      if (!input) return;
      input.focus();
      const caret = start + char.length;
      input.setSelectionRange(caret, caret);
    });
  };

  const subjectRegister = register("subject");

  const charCounter = (length: number) => (
    <p
      className={`text-right text-xs ${
        length > SUBJECT_MAX ? "text-destructive" : "text-muted-foreground"
      }`}
    >
      {length}/{SUBJECT_MAX}
    </p>
  );

  return (
    <form onSubmit={handleSubmit(onSaveDraft)} className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
          aria-live="polite"
        >
          {saveState === "saving" ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" /> Saving…
            </>
          ) : saveState === "error" ? (
            <span className="text-destructive">
              Autosave failed — use Save draft
            </span>
          ) : isDirty && !isDraftValid ? (
            <span className="text-amber-600">
              Unsaved changes — autosave needs a valid subject and body
            </span>
          ) : isDirty ? (
            <>Unsaved changes…</>
          ) : saveState === "saved" && lastSavedAt ? (
            <>Saved · {savedAgoLabel}</>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Label
            htmlFor="live-preview"
            className="text-sm text-muted-foreground"
          >
            Live preview
          </Label>
          <Switch
            id="live-preview"
            checked={livePreview}
            onCheckedChange={toggleLivePreview}
          />
        </div>
      </div>

      <div
        className={
          livePreview ? "grid gap-6 lg:grid-cols-2 lg:items-start" : undefined
        }
      >
        <Card className="shadow-lg">
          <CardContent className="pt-6 space-y-6">
            <FormField label="Subject" error={errors.subject?.message} required>
              <>
                <div className="flex gap-1.5">
                  <Input
                    {...subjectRegister}
                    ref={(el) => {
                      subjectRegister.ref(el);
                      subjectInputRef.current = el;
                    }}
                    placeholder="e.g. July classes + a new workshop"
                    disabled={isSubmitting || isSending}
                    className="flex-1"
                  />
                  <EmojiPickerPopover
                    onSelect={insertSubjectEmoji}
                    disabled={isSubmitting || isSending}
                    onCloseAutoFocus={(e) => {
                      e.preventDefault();
                      subjectInputRef.current?.focus();
                    }}
                  />
                </div>
                {charCounter(subjectValue.length)}
              </>
            </FormField>

            <FormField label="Preview text" error={errors.previewText?.message}>
              <>
                <Input
                  {...register("previewText")}
                  placeholder="Shown next to the subject in inboxes (optional)"
                  disabled={isSubmitting || isSending}
                />
                {charCounter(previewTextValue.length)}
              </>
            </FormField>

            <FormField label="Body" error={errors.content?.message} required>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <Tiptap
                    initialContent={field.value}
                    onChange={field.onChange}
                    onEditorReady={handleEditorReady}
                    placeholder="Write your newsletter…"
                    isDisabled={isSubmitting || isSending}
                    errorMessage={errors.content?.message}
                    showCharacterCount={false}
                    enableImages
                  />
                )}
              />
            </FormField>

            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" variant="outline" size="sm">
                        Insert
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onSelect={handleInsertGreeting}>
                        Greeting (&ldquo;Hey [first name]&rdquo;)
                      </DropdownMenuItem>
                      {SNIPPETS.filter((s) => s.label !== "Greeting").map(
                        (snippet) => (
                          <DropdownMenuItem
                            key={snippet.label}
                            onSelect={() => insertAtCursor(snippet.html)}
                          >
                            {snippet.label}
                          </DropdownMenuItem>
                        ),
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={() => setIsEventDialogOpen(true)}
                      >
                        <CalendarPlus className="w-4 h-4" /> Event card…
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tip: the greeting uses{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-[11px]">
                    {"{{{contact.first_name}}}"}
                  </code>
                  , so people with a name see “Hey Aaron” and everyone else sees
                  “Hey.”
                </p>
              </div>

              <div className="rounded-md border border-border p-3">
                <p className="mb-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Add below your message
                </p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="include-upcoming"
                      checked={includeUpcoming}
                      onCheckedChange={(checked) =>
                        setValue("includeUpcoming", checked, {
                          shouldDirty: true,
                        })
                      }
                      disabled={isSending}
                    />
                    <Label
                      htmlFor="include-upcoming"
                      className="text-sm font-normal text-foreground"
                    >
                      Upcoming events
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="include-classes"
                      checked={includeClasses}
                      onCheckedChange={(checked) =>
                        setValue("includeClasses", checked, {
                          shouldDirty: true,
                        })
                      }
                      disabled={isSending}
                    />
                    <Label
                      htmlFor="include-classes"
                      className="text-sm font-normal text-foreground"
                    >
                      Classes this week
                    </Label>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Switch
                    id="include-descriptions"
                    checked={includeDescriptions}
                    onCheckedChange={(checked) =>
                      setValue("includeDescriptions", checked, {
                        shouldDirty: true,
                      })
                    }
                    disabled={isSending || !includeUpcoming}
                  />
                  <Label
                    htmlFor="include-descriptions"
                    className={`text-sm font-normal ${
                      includeUpcoming
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    Include event descriptions
                  </Label>
                </div>
                <p className="mt-2.5 text-xs text-muted-foreground">
                  Turn off “Classes this week” to focus a send on just an
                  upcoming event. Empty sections are skipped automatically.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {livePreview && (
          <div className="lg:sticky lg:top-6">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Live preview
            </p>
            <iframe
              title="Live newsletter preview"
              srcDoc={livePreviewSrcDoc}
              sandbox=""
              className="h-[70vh] w-full rounded-md border bg-white shadow-lg lg:h-[78vh]"
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {!livePreview && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPreviewOpen(true)}
            >
              <Eye className="w-4 h-4" /> Preview
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            disabled={isTesting}
            onClick={handleSendTest}
          >
            {isTesting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send test to me
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="submit"
            variant="secondary"
            disabled={isSubmitting || isSending}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save draft
          </Button>
          <Button
            type="button"
            disabled={isSubmitting || isSending}
            onClick={async () => {
              if (await trigger()) setIsSendOpen(true);
            }}
          >
            <Send className="w-4 h-4" /> Send…
          </Button>
        </div>
      </div>

      {/* Preview dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Preview</DialogTitle>
            <DialogDescription>
              How the email will look in most clients.
            </DialogDescription>
          </DialogHeader>
          {isPreviewOpen && (
            <iframe
              title="Newsletter preview"
              srcDoc={previewHtml()}
              className="w-full h-[60vh] rounded-md border bg-white"
              sandbox=""
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Send dialog */}
      <Dialog open={isSendOpen} onOpenChange={setIsSendOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send newsletter</DialogTitle>
            <DialogDescription>
              {subscriberCount !== null ? (
                <>
                  Sends to{" "}
                  <strong>
                    {subscriberCount.count}
                    {subscriberCount.hasMore ? "+" : ""}
                  </strong>{" "}
                  {subscriberCount.count === 1 && !subscriberCount.hasMore
                    ? "subscriber"
                    : "subscribers"}{" "}
                  now, or pick a time.
                </>
              ) : (
                "Send to all subscribers now, or pick a time."
              )}{" "}
              Scheduled sends can be cancelled from the newsletters list until
              they go out.
            </DialogDescription>
          </DialogHeader>

          {contentIssues.blockers.length > 0 && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <p className="font-medium">Fix before sending:</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4">
                {contentIssues.blockers.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
          {contentIssues.warnings.length > 0 && (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              <p className="font-medium">Double-check:</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4">
                {contentIssues.warnings.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          <DateTimePicker
            label="Schedule for later (optional)"
            value={scheduledAt}
            onChange={setScheduledAt}
            minDate={new Date()}
            maxDate={
              // Resend's broadcast scheduling window.
              new Date(
                Date.now() + NEWSLETTER_SCHEDULE_MAX_DAYS * 24 * 60 * 60 * 1000,
              )
            }
            placeholder="Pick a date and time"
            error={
              scheduleTooFar
                ? `Resend can schedule up to ${NEWSLETTER_SCHEDULE_MAX_DAYS} days ahead — pick an earlier time.`
                : undefined
            }
          />

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={
                isSending ||
                !scheduledAt ||
                scheduleTooFar ||
                contentIssues.blockers.length > 0
              }
              onClick={() => handleSend("scheduled")}
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CalendarClock className="w-4 h-4" />
              )}
              Schedule
            </Button>
            <Button
              type="button"
              disabled={isSending || contentIssues.blockers.length > 0}
              onClick={() => handleSend("now")}
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Send now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <InsertEventDialog
        open={isEventDialogOpen}
        onOpenChange={setIsEventDialogOpen}
        onInsert={insertAtCursor}
      />
    </form>
  );
};

export default NewsletterEditor;
