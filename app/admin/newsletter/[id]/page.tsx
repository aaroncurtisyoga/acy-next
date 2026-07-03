"use client";

import { FC, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Newsletter } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import NewsletterEditor from "@/app/admin/newsletter/_components/NewsletterEditor";
import { getNewsletterById } from "@/app/_lib/actions/newsletter.actions";
import { renderNewsletterHtml } from "@/app/_lib/email/newsletter-template";
import { formatDateTime } from "@/app/_lib/utils";

const NewsletterDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getNewsletterById(id);
      setNewsletter(data);
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
        <h1 className="text-3xl font-bold text-foreground mb-6">Edit Draft</h1>
        <NewsletterEditor newsletter={newsletter} />
      </div>
    );
  }

  const isSent = newsletter.status === "SENT";
  const statusDate = isSent ? newsletter.sentAt : newsletter.scheduledAt;

  return (
    <div className="wrapper max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h1 className="text-3xl font-bold text-foreground truncate">
          {newsletter.subject}
        </h1>
        <Badge
          className={
            isSent
              ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
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
              contentHtml: newsletter.content,
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
