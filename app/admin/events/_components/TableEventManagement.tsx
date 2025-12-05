"use client";

import { FC, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Pagination } from "@heroui/pagination";
import { useDisclosure } from "@heroui/modal";
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
import BasicModal from "@/app/_components/BasicModal";
import TableEmpty from "@/app/_components/TableEmpty";
import TableLoading from "@/app/_components/TableLoading";
import EventTableToolbar from "@/app/admin/events/_components/EventTableToolbar";
import { useEventTableFilters } from "@/app/admin/events/_components/hooks/useEventTableFilters";
import { useEventTableData } from "@/app/admin/events/_components/hooks/useEventTableData";
import { TableEventManagementColumns } from "@/app/_lib/constants";
import { formatDateTime } from "@/app/_lib/utils";

const TableEventManagement: FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const {
    filters,
    hasActiveFilters,
    handleSearchChange,
    handleCategoryChange,
    handleStatusChange,
    handlePageChange,
    clearFilters,
  } = useEventTableFilters();

  const {
    events,
    categories,
    totalPages,
    totalCount,
    loading,
    handleDeleteEvent,
  } = useEventTableData(filters);

  const onDeleteClick = (event: any) => {
    setSelectedEvent(event);
    onOpen();
  };

  const onConfirmDelete = async () => {
    if (!selectedEvent) return;
    const success = await handleDeleteEvent(selectedEvent.id);
    if (success) {
      onOpenChange();
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <EventTableToolbar
          searchText=""
          category=""
          statusFilter="all"
          categories={[]}
          hasActiveFilters={false}
          disabled={true}
          onSearchChange={() => {}}
          onCategoryChange={() => {}}
          onStatusChange={() => {}}
          onClearFilters={() => {}}
        />
        <TableLoading columns={TableEventManagementColumns} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <EventTableToolbar
        searchText={filters.searchText}
        category={filters.category}
        statusFilter={filters.statusFilter}
        categories={categories}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
        onClearFilters={clearFilters}
      />

      <div className="flex justify-between items-center">
        <p className="text-default-400 text-sm">
          {totalCount} {totalCount === 1 ? "event" : "events"} found
          {hasActiveFilters && " (filtered)"}
        </p>
      </div>

      {events.length === 0 ? (
        <TableEmpty
          columns={TableEventManagementColumns}
          message={
            hasActiveFilters
              ? "No events found matching your filters"
              : "No events have been created yet"
          }
        />
      ) : (
        <Table
          aria-label="Table for Managing Events"
          classNames={{ wrapper: "min-h-[400px]" }}
        >
          <TableHeader>
            {TableEventManagementColumns.map((column) => (
              <TableColumn key={column}>{column}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id} className="hover:bg-default-50">
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
                          <ExternalLink
                            size={14}
                            className="text-default-400 mt-0.5"
                          />
                        </Tooltip>
                      )}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-default-400" />
                        <p className="text-xs text-default-500">
                          {event.location.name ||
                            event.location.formattedAddress}
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
            ))}
          </TableBody>
        </Table>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            total={totalPages}
            page={filters.page}
            onChange={handlePageChange}
            showControls
            color="primary"
            variant="flat"
          />
        </div>
      )}

      <BasicModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        header={<h1>Confirm deletion for this event</h1>}
        primaryAction={onConfirmDelete}
        primaryActionLabel="Delete"
      >
        {selectedEvent && (
          <div>
            <p className="mb-5">Are you sure you want to delete this event?</p>
            <p>
              <b>Event:</b> {selectedEvent.title}
            </p>
            <p>
              <b>Category:</b> {selectedEvent.category.name}
            </p>
            <p>
              <b>Date:</b>{" "}
              {formatDateTime(selectedEvent.startDateTime).dateTime}
            </p>
          </div>
        )}
      </BasicModal>
    </div>
  );
};

export default TableEventManagement;
