"use client";

import { FC, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { getAllEvents } from "@/lib/actions/event.actions";
import { formatDateTime, handleError } from "@/lib/utils";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

const TableEventManagement: FC = () => {
  // todo: consider creating a custom hook for this data fetching & pagination
  const [events, setEvents] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, totalPages } = await getAllEvents({
          category,
          limit: 8,
          page,
          query: searchText,
        });
        setEvents(data);
        setTotalPages(totalPages);
      } catch (error) {
        handleError("Failed to fetch events", error);
      }
    };
    fetchEvents();
  }, [page, searchText, category]);

  return (
    <Table aria-label={"Table for Managing Events"} className={"mt-5"}>
      <TableHeader>
        <TableColumn>Start Date</TableColumn>
        <TableColumn>Name</TableColumn>
        <TableColumn>Category</TableColumn>
        <TableColumn>Actions</TableColumn>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell>
              {formatDateTime(event.startDateTime).dateTime}
            </TableCell>
            <TableCell>{event.title}</TableCell>
            <TableCell>{event.category.name}</TableCell>
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
                    <Trash2 size={16} onClick={() => {}} />
                  </span>
                </Tooltip>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableEventManagement;
