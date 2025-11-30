"use client";

import { FC } from "react";
import Link from "next/link";
import { TableCell, TableRow } from "@heroui/table";
import { Tooltip } from "@heroui/tooltip";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import {
  Eye,
  Pencil,
  Trash2,
  ExternalLink,
  MapPin,
  Calendar,
  Users,
  DollarSign,
} from "lucide-react";
import { formatDateTime } from "@/app/_lib/utils";

interface EventTableRowProps {
  event: any;
  onDeleteClick: (event: any) => void;
}

const EventTableRow: FC<EventTableRowProps> = ({ event, onDeleteClick }) => {
  return (
    <TableRow className="hover:bg-default-50">
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-default-400" />
            <span className="font-medium">
              {formatDateTime(event.startDateTime).dateOnly}
            </span>
          </div>
          <p className="text-xs text-default-400">
            {formatDateTime(event.startDateTime).timeOnly}
          </p>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <p className="font-medium">{event.title}</p>
            {event.isExternal && (
              <Tooltip content="Synced from external source">
                <ExternalLink size={14} className="text-default-400 mt-0.5" />
              </Tooltip>
            )}
          </div>
          {event.location && (
            <div className="flex items-center gap-1">
              <MapPin size={12} className="text-default-400" />
              <p className="text-xs text-default-500">
                {event.location.name || event.location.formattedAddress}
              </p>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Chip variant="flat" color="primary" size="sm">
          {event.category.name}
        </Chip>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-2">
          <Chip
            variant="dot"
            color={event.isActive ? "success" : "default"}
            size="sm"
          >
            {event.isActive ? "Active" : "Inactive"}
          </Chip>
          {event.isFree ? (
            <Chip variant="flat" color="success" size="sm">
              Free
            </Chip>
          ) : (
            event.price && (
              <Chip
                variant="flat"
                color="warning"
                size="sm"
                startContent={<DollarSign size={12} />}
              >
                {event.price}
              </Chip>
            )
          )}
          {event.maxAttendees && (
            <Chip
              variant="flat"
              color="default"
              size="sm"
              startContent={<Users size={12} />}
            >
              {event.maxAttendees}
            </Chip>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          {!event.isExternal && (
            <Tooltip content="View">
              <Button
                as={Link}
                href={`/events/${event.id}`}
                isIconOnly
                size="sm"
                variant="light"
                aria-label="View event"
              >
                <Eye size={18} />
              </Button>
            </Tooltip>
          )}
          <Tooltip content="Edit">
            <Button
              as={Link}
              href={`/admin/events/${event.id}/edit`}
              isIconOnly
              size="sm"
              variant="light"
              color="primary"
              aria-label="Edit event"
            >
              <Pencil size={18} />
            </Button>
          </Tooltip>
          <Tooltip content="Delete">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
              aria-label="Delete event"
              onPress={() => onDeleteClick(event)}
            >
              <Trash2 size={18} />
            </Button>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default EventTableRow;
