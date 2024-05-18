"use client";

import { FC, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Event } from "@prisma/client";
import { getAllEvents } from "@/lib/actions/event.actions";
import { handleError } from "@/lib/utils";

const TableEventManagement: FC = () => {
  const [events, setEvents] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data: events, totalPages } = await getAllEvents({
          category,
          limit: 8,
          page,
          query: searchText,
        });
        setEvents(events);
        setTotalPages(totalPages);
      } catch (error) {
        handleError("Failed to fetch events", error);
      }
    };
    fetchEvents();
  }, [page, searchText, category]);

  return (
    <>
      <Table aria-label={"Table for Managing Events"} className={"mt-5"}>
        <TableHeader>
          <TableColumn>Start Date</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Category</TableColumn>
        </TableHeader>
        <TableBody>
          {events.map((event: Event) => (
            <TableRow key={event.id}>
              <TableCell>{event.startDateTime.toDateString()}</TableCell>
              <TableCell>{event.title}</TableCell>
              <TableCell>{event.categoryId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      ;
    </>
  );
};

export default TableEventManagement;
