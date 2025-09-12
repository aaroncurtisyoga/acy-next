"use client";

import { FC, useEffect, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
  addToast,
} from "@heroui/react";
import { Eye, Pencil, Trash2, ExternalLink } from "lucide-react";
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
  // const [totalPages, setTotalPages] = useState(0); // Unused - commented for future pagination
  const [page /*, setPage */] = useState(1); // setPage for future pagination
  const [searchText /*, setSearchText */] = useState(""); // setSearchText for future search
  const [category /*, setCategory */] = useState(""); // setCategory for future filtering

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data /* , totalPages */ } = await getAllEvents({
          category,
          limit: 8,
          page,
          query: searchText,
        });
        setEvents(data);
        // setTotalPages(totalPages); // Unused - for future pagination
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
  }, [page, searchText, category]);

  const handleDeleteEvent = async () => {
    try {
      const response = await deleteEvent(selectedEvent.id);
      if (response.success) {
        onOpenChange();
        setEvents(events.filter((event) => event.id !== selectedEvent.id));

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

  if (loading) {
    return <TableLoading columns={TableEventManagementColumns} />;
  }

  if (events.length === 0) {
    return (
      <TableEmpty
        columns={TableEventManagementColumns}
        message={"No events have been created yet"}
      />
    );
  }

  return (
    <>
      <Table aria-label={"Table for Managing Events"} className={"mt-5"}>
        <TableHeader>
          {TableEventManagementColumns.map((column) => (
            <TableColumn key={column}>{column}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>
                {formatDateTime(event.startDateTime).dateTime}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {event.title}
                  {event.isExternal && (
                    <Tooltip content="Synced from external source">
                      <ExternalLink size={14} className="text-default-400" />
                    </Tooltip>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {event.category.name}
                  {event.sourceType && (
                    <span className="text-xs text-default-400">
                      ({event.sourceType})
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Tooltip content={"View"}>
                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                      <Link href={`/events/${event.id}`}>
                        <Eye size={16} />
                      </Link>
                    </span>
                  </Tooltip>
                  <Tooltip content={"Edit"}>
                    <span className="text-lg text-primary-400 cursor-pointer active:opacity-50">
                      <Link href={`/admin/events/${event.id}/edit`}>
                        <Pencil size={16} />
                      </Link>
                    </span>
                  </Tooltip>
                  <Tooltip content={"Delete"}>
                    <span className="text-lg text-danger-600 cursor-pointer active:opacity-50">
                      <Trash2
                        size={16}
                        onClick={() => {
                          setSelectedEvent(event);
                          onOpen();
                        }}
                      />
                    </span>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <BasicModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        header={<h1>Confirm deletion for this event</h1>}
        primaryAction={handleDeleteEvent}
        primaryActionLabel={"Delete"}
      >
        {selectedEvent && (
          <div>
            <p className={"mb-5"}>
              Are you sure you want to delete this event?
            </p>
            <p>
              <b>Event:</b> {`${selectedEvent.title}`}
            </p>
            <p>
              <b>Category:</b> {`${selectedEvent.category.name}`}
            </p>
          </div>
        )}
      </BasicModal>
    </>
  );
};

export default TableEventManagement;
