"use client";

import { FC, useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { getAllEvents } from "@/app/_lib/actions/event.actions";
import { eventCardHtml, eventWhenLabel } from "@/app/_lib/email/event-html";
import { EventWithLocationAndCategory } from "@/app/_lib/types";

interface InsertEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Receives ready-to-insert, Tiptap-schema-safe card HTML. */
  onInsert: (html: string) => void;
}

/**
 * Pick an upcoming event and drop a card for it (photo, title, date, sign-up
 * link) into the newsletter body at the caret — for featuring one event inline
 * rather than relying on the auto-appended sections.
 */
const InsertEventDialog: FC<InsertEventDialogProps> = ({
  open,
  onOpenChange,
  onInsert,
}) => {
  // null = not yet loaded (show a spinner); an array = loaded. Modelling
  // loading as data state avoids a synchronous setState in the effect body.
  const [events, setEvents] = useState<EventWithLocationAndCategory[] | null>(
    null,
  );
  const [withImage, setWithImage] = useState(true);

  useEffect(() => {
    if (!open) return undefined;
    let active = true;
    getAllEvents({ query: "", category: "", limit: 25, page: 1 })
      .then((result) => {
        if (active) setEvents(result?.data ?? []);
      })
      .catch(() => {
        // Show the empty state (not a permanent spinner) and flag the failure —
        // otherwise it would masquerade as "no upcoming events found".
        if (active) {
          setEvents([]);
          toast.error("Couldn't load events. Try reopening.");
        }
      });
    return () => {
      active = false;
    };
  }, [open]);

  const handlePick = (event: EventWithLocationAndCategory) => {
    onInsert(eventCardHtml(event, { withImage }));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg max-h-[85vh] flex flex-col"
        // handlePick focuses the editor; don't let Radix pull focus back to
        // the Insert dropdown trigger.
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Insert an event</DialogTitle>
          <DialogDescription>
            Adds a card with the event&apos;s details and a sign-up link where
            your cursor is.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <Checkbox
            id="event-card-image"
            checked={withImage}
            onCheckedChange={(checked) => setWithImage(checked === true)}
          />
          <Label
            htmlFor="event-card-image"
            className="text-sm font-normal text-foreground"
          >
            Include the event photo (when it has one)
          </Label>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 -mx-1 px-1">
          {events === null ? (
            <div className="flex justify-center py-10">
              <Spinner />
            </div>
          ) : events.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No upcoming events found.
            </p>
          ) : (
            <ul className="space-y-1">
              {events.map((event) => (
                <li key={event.id}>
                  <button
                    type="button"
                    onClick={() => handlePick(event)}
                    className="flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-accent"
                  >
                    {event.imageUrl ? (
                      // Plain img: synced events can point at arbitrary hosts
                      // that next/image hasn't been configured for.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={event.imageUrl}
                        alt=""
                        className="h-12 w-16 shrink-0 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded bg-muted">
                        <CalendarDays className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {event.title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {eventWhenLabel(event)}
                        {event.location?.name
                          ? ` · ${event.location.name}`
                          : ""}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InsertEventDialog;
