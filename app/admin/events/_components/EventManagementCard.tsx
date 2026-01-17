"use client";

import { FC } from "react";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
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
import AdminCard from "@/app/admin/_components/AdminCard";
import { formatDateTime } from "@/app/_lib/utils";

interface EventManagementCardProps {
  event: any;
  onDeleteClick: (event: any) => void;
}

const EventManagementCard: FC<EventManagementCardProps> = ({
  event,
  onDeleteClick,
}) => {
  return (
    <AdminCard>
      <div className="space-y-3">
        {/* Header: Title + External badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <p className="font-medium text-base truncate">{event.title}</p>
            {event.isExternal && (
              <Tooltip content="Synced from external source">
                <span role="img" aria-label="Synced from external source">
                  <ExternalLink
                    size={14}
                    className="text-default-400 mt-0.5 flex-shrink-0"
                  />
                </span>
              </Tooltip>
            )}
          </div>
          <Chip
            variant="flat"
            color="primary"
            size="sm"
            className="flex-shrink-0"
          >
            {event.category.name}
          </Chip>
        </div>

        {/* Date & Time */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={14} className="text-default-400" />
          <span className="font-medium">
            {formatDateTime(event.startDateTime).dateOnly}
          </span>
          <span className="text-default-400">at</span>
          <span className="text-default-500">
            {formatDateTime(event.startDateTime).timeOnly}
          </span>
        </div>

        {/* Location */}
        {event.location && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={14} className="text-default-400" />
            <p className="text-default-500 truncate">
              {event.location.name || event.location.formattedAddress}
            </p>
          </div>
        )}

        {/* Status chips */}
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

        {/* Actions */}
        <div className="flex items-center gap-1 pt-2 border-t border-divider">
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
      </div>
    </AdminCard>
  );
};

export default EventManagementCard;
