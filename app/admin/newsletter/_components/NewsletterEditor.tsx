"use client";

import { FC, useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Newsletter } from "@prisma/client";
import { Editor } from "@tiptap/react";
import { toast } from "sonner";
import {
  CalendarClock,
  CalendarPlus,
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
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import Tiptap from "@/app/_components/Tiptap";
import { renderNewsletterHtml } from "@/app/_lib/email/newsletter-template";
import {
  createNewsletter,
  getUpcomingEventsForNewsletter,
  sendNewsletter,
  sendTestNewsletter,
  updateNewsletter,
} from "@/app/_lib/actions/newsletter.actions";
import { NewsletterComposeSchema } from "@/app/_lib/schema";
import { formatDateTime } from "@/app/_lib/utils";

type ComposeInputs = z.infer<typeof NewsletterComposeSchema>;

interface NewsletterEditorProps {
  newsletter?: Newsletter;
}

const NewsletterEditor: FC<NewsletterEditorProps> = ({ newsletter }) => {
  const router = useRouter();
  const editorRef = useRef<Editor | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>();
  const [isSending, setIsSending] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isInsertingEvents, setIsInsertingEvents] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<ComposeInputs>({
    resolver: zodResolver(NewsletterComposeSchema),
    defaultValues: {
      subject: newsletter?.subject ?? "",
      previewText: newsletter?.previewText ?? "",
      content: newsletter?.content ?? "",
    },
  });

  const handleEditorReady = useCallback((editor: Editor) => {
    editorRef.current = editor;
  }, []);

  const saveDraft = async (data: ComposeInputs) => {
    const result = newsletter
      ? await updateNewsletter(newsletter.id, data)
      : await createNewsletter(data);

    if (!result.status || !result.data) {
      toast.error(result.message ?? "Failed to save the draft.");
      return null;
    }
    return result.data;
  };

  const onSaveDraft = async (data: ComposeInputs) => {
    const saved = await saveDraft(data);
    if (!saved) return;
    toast.success("Draft saved");
    if (!newsletter) {
      router.replace(`/admin/newsletter/${saved.id}`);
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
    } finally {
      setIsTesting(false);
    }
  };

  const handleInsertEvents = async () => {
    setIsInsertingEvents(true);
    try {
      const events = await getUpcomingEventsForNewsletter();
      if (events.length === 0) {
        toast.info("No upcoming events found.");
        return;
      }
      const items = events
        .map((event) => {
          const { dateOnlyWithoutYear, timeOnly } = formatDateTime(
            event.startDateTime,
          );
          const locationName = event.location?.name
            ? ` · ${event.location.name}`
            : "";
          return `<li><strong><a href="https://www.aaroncurtisyoga.com/events/${event.id}">${event.title}</a></strong> — ${dateOnlyWithoutYear} · ${timeOnly}${locationName}</li>`;
        })
        .join("");
      editorRef.current
        ?.chain()
        .focus("end")
        .insertContent(`<h2>Upcoming Classes</h2><ul>${items}</ul>`)
        .run();
    } finally {
      setIsInsertingEvents(false);
    }
  };

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
    }

    setIsSending(true);
    try {
      // The broadcast is built from the saved row, so persist edits first
      const saved = await saveDraft(getValues());
      if (!saved) return;

      const result = await sendNewsletter(
        saved.id,
        when === "scheduled" ? scheduledAt!.toISOString() : undefined,
      );
      if (!result.status) {
        toast.error(result.message);
        // The draft row now exists even if this started from /create
        if (!newsletter) router.replace(`/admin/newsletter/${saved.id}`);
        return;
      }

      toast.success(
        when === "scheduled"
          ? `Scheduled for ${formatDateTime(scheduledAt!).dateTime}`
          : "Newsletter sent!",
      );
      router.push("/admin/newsletter");
    } finally {
      setIsSending(false);
    }
  };

  const previewHtml = () =>
    renderNewsletterHtml({
      contentHtml: getValues("content") || "<p>Nothing here yet…</p>",
      previewText: getValues("previewText"),
      unsubscribeUrl: "#",
    });

  return (
    <form onSubmit={handleSubmit(onSaveDraft)} className="space-y-6">
      <Card className="shadow-lg">
        <CardContent className="pt-6 space-y-6">
          <FormField label="Subject" error={errors.subject?.message} required>
            <Input
              {...register("subject")}
              placeholder="e.g. July classes + a new workshop"
              disabled={isSubmitting || isSending}
            />
          </FormField>

          <FormField label="Preview text" error={errors.previewText?.message}>
            <Input
              {...register("previewText")}
              placeholder="Shown next to the subject in inboxes (optional)"
              disabled={isSubmitting || isSending}
            />
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
                />
              )}
            />
          </FormField>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isInsertingEvents}
            onClick={handleInsertEvents}
          >
            {isInsertingEvents ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CalendarPlus className="w-4 h-4" />
            )}
            Insert upcoming classes
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsPreviewOpen(true)}
          >
            <Eye className="w-4 h-4" /> Preview
          </Button>
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
              Send to all subscribers now, or pick a time. Scheduled sends are
              handled by Resend and can&apos;t be cancelled from here.
            </DialogDescription>
          </DialogHeader>

          <DateTimePicker
            label="Schedule for later (optional)"
            value={scheduledAt}
            onChange={setScheduledAt}
            minDate={new Date()}
            placeholder="Pick a date and time"
          />

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={isSending || !scheduledAt}
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
              disabled={isSending}
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
    </form>
  );
};

export default NewsletterEditor;
