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
import BasicModal from "@/app/_components/BasicModal";
import { useDisclosure } from "@/app/_hooks/useDisclosure";
import {
  deleteNewsletter,
  duplicateNewsletter,
} from "@/app/_lib/actions/newsletter.actions";
import { formatDateTime } from "@/app/_lib/utils";

const statusVariants: Record<
  Newsletter["status"],
  "secondary" | "warning" | "success"
> = {
  DRAFT: "secondary",
  SCHEDULED: "warning",
  SENT: "success",
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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [newsletterToDelete, setNewsletterToDelete] =
    useState<Newsletter | null>(null);

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

  const handleDeleteClick = (newsletter: Newsletter) => {
    setNewsletterToDelete(newsletter);
    onOpen();
  };

  const handleConfirmDelete = async () => {
    if (!newsletterToDelete) return;
    setBusyId(newsletterToDelete.id);
    try {
      const result = await deleteNewsletter(newsletterToDelete.id);
      if (result.status) {
        toast.success("Newsletter deleted");
        onOpenChange(false);
        setNewsletterToDelete(null);
        await onChanged();
      } else {
        toast.error(result.message);
      }
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
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
                <Badge variant={statusVariants[newsletter.status]}>
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
                        onClick={() => handleDeleteClick(newsletter)}
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

      <BasicModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        header="Delete newsletter"
        primaryAction={handleConfirmDelete}
        primaryActionLabel="Delete"
      >
        {newsletterToDelete && (
          <div>
            <p className="mb-4">
              Are you sure you want to delete this newsletter? This can&apos;t
              be undone.
            </p>
            <p className="font-medium">{newsletterToDelete.subject}</p>
          </div>
        )}
      </BasicModal>
    </>
  );
};

export default NewsletterTable;
