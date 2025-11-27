"use client";

import { FC, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Tooltip } from "@heroui/tooltip";
import { useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Pagination } from "@heroui/pagination";
import {
  Eye,
  Pencil,
  Trash2,
  ExternalLink,
  Search,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  X,
} from "lucide-react";
import BasicModal from "@/app/_components/BasicModal";
import TableEmpty from "@/app/_components/TableEmpty";
import TableLoading from "@/app/_components/TableLoading";
import { deleteEvent, getAllEvents } from "@/app/_lib/actions/event.actions";
import { TableEventManagementColumns } from "@/app/_lib/constants";
import { formatDateTime, handleError } from "@/app/_lib/utils";

const TableEventManagement: FC = () => {
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, inactive

  // Fetch categories for filter dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { getAllCategories } = await import(
          "@/app/_lib/actions/category.actions"
        );
        const fetchedCategories = await getAllCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const {
          data,
          totalPages: pages,
          totalCount: count,
        } = await getAllEvents({
          category,
          limit: 10,
          page,
          query: searchText,
          isActive:
            statusFilter === "all" ? undefined : statusFilter === "active",
        });
        setEvents(data);
        setTotalPages(pages);
        setTotalCount(count);
      } catch (error) {
        handleError("Failed to fetch events", error);
        addToast({
          title: "Error",
          description: "Failed to fetch events. Please try again.",
          color: "danger",
          timeout: 5000,
          shouldShowTimeoutProgress: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [page, searchText, category, statusFilter]);

  const handleDeleteEvent = async () => {
    try {
      const response = await deleteEvent(selectedEvent.id);
      if (response.success) {
        onOpenChange();
        setEvents(events.filter((event) => event.id !== selectedEvent.id));
        setTotalCount(totalCount - 1);

        // Show success toast
        addToast({
          title: "Success",
          description: "Event deleted successfully",
          color: "success",
          timeout: 3000,
          shouldShowTimeoutProgress: true,
        });
      } else {
        throw new Error("Failed to delete event");
      }
    } catch (error) {
      handleError("Failed to delete event", error);

      // Show error toast
      addToast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        color: "danger",
        timeout: 5000,
        shouldShowTimeoutProgress: true,
      });
    }
  };

  const handleSearchChange = useCallback((value: string) => {
    setSearchText(value);
    setPage(1); // Reset to first page on search
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setCategory(value);
    setPage(1); // Reset to first page on filter change
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setStatusFilter(value);
    setPage(1); // Reset to first page on filter change
  }, []);

  const clearFilters = useCallback(() => {
    setSearchText("");
    setCategory("");
    setStatusFilter("all");
    setPage(1);
  }, []);

  const hasActiveFilters = searchText || category || statusFilter !== "all";

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search events..."
              startContent={<Search className="text-default-400" size={18} />}
              disabled
              className="max-w-xs"
            />
          </div>
        </div>
        <TableLoading columns={TableEventManagementColumns} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            isClearable
            placeholder="Search events..."
            value={searchText}
            onValueChange={handleSearchChange}
            startContent={<Search className="text-default-400" size={18} />}
            className="max-w-xs"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Select
            placeholder="All Categories"
            className="w-44"
            selectedKeys={category ? [category] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              handleCategoryChange(selected || "");
            }}
          >
            {categories.map((cat: any) => (
              <SelectItem key={cat.id}>{cat.name}</SelectItem>
            ))}
          </Select>
          <Select
            placeholder="Status"
            className="w-36"
            selectedKeys={[statusFilter]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              handleStatusChange(selected);
            }}
          >
            <SelectItem key="all">All Events</SelectItem>
            <SelectItem key="active">Active</SelectItem>
            <SelectItem key="inactive">Inactive</SelectItem>
          </Select>
          {hasActiveFilters && (
            <Button
              color="default"
              variant="flat"
              size="md"
              startContent={<X size={16} />}
              onPress={clearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Results count */}
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
          classNames={{
            wrapper: "min-h-[400px]",
          }}
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
                        onPress={() => {
                          setSelectedEvent(event);
                          onOpen();
                        }}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            total={totalPages}
            page={page}
            onChange={setPage}
            showControls
            color="primary"
            variant="flat"
          />
        </div>
      )}
      {/* Delete Confirmation Modal */}
      <BasicModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        header={<h1>Confirm deletion for this event</h1>}
        primaryAction={handleDeleteEvent}
        primaryActionLabel="Delete"
      >
        {selectedEvent && (
          <div>
            <p className="mb-5">Are you sure you want to delete this event?</p>
            <p>
              <b>Event:</b> {`${selectedEvent.title}`}
            </p>
            <p>
              <b>Category:</b> {`${selectedEvent.category.name}`}
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
