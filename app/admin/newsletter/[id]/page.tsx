"use client";

import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Newsletter } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import NewsletterEditor from "@/app/admin/newsletter/_components/NewsletterEditor";
import {
  getNewsletterById,
  getNewsletterEventSectionsHtml,
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [data, sections] = await Promise.all([
        getNewsletterById(id),
        getNewsletterEventSectionsHtml(),
      ]);
      setNewsletter(data);
      setSectionsHtml(sections);
      setIsLoading(false);
    };
    load();
  }, [id]);

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
          Edit Draft
        </h1>
        <NewsletterEditor newsletter={newsletter} />
      </div>
    );
  }

  const isSent = newsletter.status === "SENT";
  const statusDate = isSent ? newsletter.sentAt : newsletter.scheduledAt;

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
      </div>

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
    </div>
  );
};

export default NewsletterDetailPage;
