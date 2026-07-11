"use client";

import { FC, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarOff, Loader2 } from "lucide-react";
import { Newsletter } from "@prisma/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import BasicModal from "@/app/_components/BasicModal";
import NewsletterEditor from "@/app/admin/newsletter/_components/NewsletterEditor";
import {
  cancelScheduledNewsletter,
  getNewsletterById,
  getNewsletterEventSectionsHtml,
  getNewsletterTopLinks,
  type NewsletterTopLink,
} from "@/app/_lib/actions/newsletter.actions";
import {
  renderNewsletterHtml,
  resolveMergeTags,
} from "@/app/_lib/email/newsletter-template";
import { formatDateTime } from "@/app/_lib/utils";

const NewsletterDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [sectionsHtml, setSectionsHtml] = useState("");
  const [topLinks, setTopLinks] = useState<NewsletterTopLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const load = useCallback(async () => {
    const data = await getNewsletterById(id);
    setNewsletter(data);
    // The read-only view should show what was (or will be) actually sent, so
    // build the sections from the row's persisted toggles. Drafts render the
    // editor, which fetches its own live sections.
    if (data && data.status !== "DRAFT") {
      const [sections, links] = await Promise.all([
        getNewsletterEventSectionsHtml({
          includeUpcoming: data.includeUpcoming,
          includeClasses: data.includeClasses,
          includeDescriptions: data.includeDescriptions,
          // A scheduled send's sections are built for its send moment, so
          // preview the same thing here.
          at:
            data.status === "SCHEDULED" && data.scheduledAt
              ? new Date(data.scheduledAt)
              : undefined,
        }),
        data.status === "SENT" ? getNewsletterTopLinks(id) : [],
      ]);
      setSectionsHtml(sections);
      setTopLinks(links);
    } else {
      setSectionsHtml("");
      setTopLinks([]);
    }
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleConfirmCancel = async () => {
    if (!newsletter) return;
    setIsCancelling(true);
    try {
      const result = await cancelScheduledNewsletter(newsletter.id);
      if (result.status) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      setIsCancelOpen(false);
      // Either way the status may have changed (DRAFT after cancel, SENT if
      // it already went out) — refetch and let the page re-render.
      await load();
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!newsletter) {
    return (
      <div className="wrapper max-w-4xl mx-auto text-center py-16 text-muted-foreground">
        Newsletter not found.
      </div>
    );
  }

  if (newsletter.status === "DRAFT") {
    return (
      <div className="wrapper max-w-4xl mx-auto">
        <Link
          href="/admin/newsletter"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Newsletters
        </Link>
        <h1 className="mb-6 font-display text-3xl uppercase text-foreground">
          Newsletter Draft
        </h1>
        <NewsletterEditor newsletter={newsletter} />
      </div>
    );
  }

  const isSent = newsletter.status === "SENT";
  const statusDate = isSent ? newsletter.sentAt : newsletter.scheduledAt;
  const hasStats =
    isSent &&
    (newsletter.deliveredCount > 0 ||
      newsletter.openedCount > 0 ||
      newsletter.clickedCount > 0 ||
      newsletter.bouncedCount > 0);
  const openRate =
    newsletter.deliveredCount > 0
      ? Math.round((newsletter.openedCount / newsletter.deliveredCount) * 100)
      : null;

  return (
    <div className="wrapper max-w-4xl mx-auto">
      <Link
        href="/admin/newsletter"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Newsletters
      </Link>
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h1 className="truncate font-display text-3xl uppercase text-foreground">
          {newsletter.subject}
        </h1>
        <div className="flex items-center gap-2">
          <Badge
            className={
              isSent
                ? "bg-green-100 text-green-800"
                : "bg-amber-100 text-amber-800"
            }
          >
            {isSent ? "Sent" : "Scheduled"}
            {statusDate && ` · ${formatDateTime(statusDate).dateTime}`}
          </Badge>
          {newsletter.status === "SCHEDULED" && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setIsCancelOpen(true)}
            >
              <CalendarOff className="h-4 w-4" /> Cancel send
            </Button>
          )}
        </div>
      </div>

      {hasStats && (
        <>
          <div className="mb-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Delivered", value: newsletter.deliveredCount },
              {
                label: "Opened",
                value:
                  openRate !== null
                    ? `${newsletter.openedCount} (${openRate}%)`
                    : newsletter.openedCount,
              },
              { label: "Clicked", value: newsletter.clickedCount },
              { label: "Bounced", value: newsletter.bouncedCount },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mb-6 text-xs text-muted-foreground">
            Unique recipients. Open counts are approximate — Apple Mail preloads
            images, which registers as an open.
          </p>
        </>
      )}

      {topLinks.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Top clicked links
            </p>
            <ul className="mt-2 space-y-1.5">
              {topLinks.map(({ link, clicks }) => (
                <li
                  key={link}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate text-primary hover:underline"
                    title={link}
                  >
                    {link
                      .replace(/^https?:\/\/(www\.)?/, "")
                      .replace(/\/$/, "")}
                  </a>
                  <span className="shrink-0 text-muted-foreground">
                    {clicks} {clicks === 1 ? "person" : "people"}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <iframe
            title="Newsletter content"
            srcDoc={renderNewsletterHtml({
              contentHtml: `${resolveMergeTags(newsletter.content)}${sectionsHtml}`,
              previewText: newsletter.previewText ?? undefined,
              unsubscribeUrl: "#",
            })}
            className="w-full h-[70vh] rounded-md border bg-white"
            sandbox=""
          />
        </CardContent>
      </Card>

      <BasicModal
        isOpen={isCancelOpen}
        onOpenChange={setIsCancelOpen}
        header="Cancel scheduled send"
        primaryAction={handleConfirmCancel}
        primaryActionLabel={isCancelling ? "Cancelling…" : "Cancel the send"}
        primaryActionDisabled={isCancelling}
        cancelLabel="Keep it scheduled"
      >
        <div>
          <p className="mb-4">
            This pulls the newsletter out of Resend&apos;s queue and returns it
            to a draft you can edit or re-schedule.
          </p>
          <p className="font-medium">{newsletter.subject}</p>
          {newsletter.scheduledAt && (
            <p className="mt-1 text-sm text-muted-foreground">
              Currently scheduled for{" "}
              {formatDateTime(newsletter.scheduledAt).dateTime}
            </p>
          )}
          {isCancelling && (
            <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Cancelling…
            </p>
          )}
        </div>
      </BasicModal>
    </div>
  );
};

export default NewsletterDetailPage;
