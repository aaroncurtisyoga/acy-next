"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { Newsletter } from "@prisma/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";
import { Copy, Pencil, Eye, Trash2 } from "lucide-react";
import {
  deleteNewsletter,
  duplicateNewsletter,
} from "@/app/_lib/actions/newsletter.actions";
import { formatDateTime } from "@/app/_lib/utils";

const statusStyles: Record<Newsletter["status"], string> = {
  DRAFT: "bg-muted text-muted-foreground",
  SCHEDULED:
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  SENT: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
};

const statusLabels: Record<Newsletter["status"], string> = {
  DRAFT: "Draft",
  SCHEDULED: "Scheduled",
  SENT: "Sent",
};

interface NewsletterTableProps {
  newsletters: Newsletter[];
  onChanged: () => Promise<void>;
}

const NewsletterTable: FC<NewsletterTableProps> = ({
  newsletters,
  onChanged,
}) => {
  const [busyId, setBusyId] = useState<string | null>(null);

  const describeDate = (newsletter: Newsletter) => {
    if (newsletter.status === "SENT" && newsletter.sentAt) {
      const { dateOnly, timeOnly } = formatDateTime(newsletter.sentAt);
      return `Sent ${dateOnly} · ${timeOnly}`;
    }
    if (newsletter.status === "SCHEDULED" && newsletter.scheduledAt) {
      const { dateOnly, timeOnly } = formatDateTime(newsletter.scheduledAt);
      return `Sends ${dateOnly} · ${timeOnly}`;
    }
    const { dateOnly } = formatDateTime(newsletter.updatedAt);
    return `Edited ${dateOnly}`;
  };

  const handleDuplicate = async (id: string) => {
    setBusyId(id);
    try {
      const result = await duplicateNewsletter(id);
      if (result.status) {
        toast.success("Draft duplicated");
        await onChanged();
      } else {
        toast.error(result.message);
      }
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (newsletter: Newsletter) => {
    if (
      !window.confirm(`Delete "${newsletter.subject}"? This can't be undone.`)
    ) {
      return;
    }
    setBusyId(newsletter.id);
    try {
      const result = await deleteNewsletter(newsletter.id);
      if (result.status) {
        toast.success("Newsletter deleted");
        await onChanged();
      } else {
        toast.error(result.message);
      }
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Subject</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {newsletters.map((newsletter) => (
          <TableRow key={newsletter.id}>
            <TableCell className="font-medium max-w-[320px] truncate">
              <Link
                href={`/admin/newsletter/${newsletter.id}`}
                className="hover:text-primary transition-colors"
              >
                {newsletter.subject}
              </Link>
            </TableCell>
            <TableCell>
              <Badge className={statusStyles[newsletter.status]}>
                {statusLabels[newsletter.status]}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {describeDate(newsletter)}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <SimpleTooltip
                  content={newsletter.status === "DRAFT" ? "Edit" : "View"}
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    asChild
                  >
                    <Link href={`/admin/newsletter/${newsletter.id}`}>
                      {newsletter.status === "DRAFT" ? (
                        <Pencil className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Link>
                  </Button>
                </SimpleTooltip>
                <SimpleTooltip content="Duplicate">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    disabled={busyId === newsletter.id}
                    onClick={() => handleDuplicate(newsletter.id)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </SimpleTooltip>
                {newsletter.status !== "SCHEDULED" && (
                  <SimpleTooltip content="Delete">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      disabled={busyId === newsletter.id}
                      onClick={() => handleDelete(newsletter)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </SimpleTooltip>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default NewsletterTable;
