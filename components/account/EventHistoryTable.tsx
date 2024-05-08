"use client";

import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Link as NextUiLink,
} from "@nextui-org/react";
import { formatDateTime, formatPrice } from "@/lib/utils";
import { OrderResponse } from "@/app/(root)/account/page";

interface EventHistoryTableProps {
  orders: OrderResponse;
}
const EventHistoryTable: FC<EventHistoryTableProps> = ({ orders }) => {
  return (
    <Table aria-label={"Table for Event Purchase History"}>
      <TableHeader>
        <TableColumn>Date</TableColumn>
        <TableColumn>Amount</TableColumn>
        <TableColumn>Event</TableColumn>
        <TableColumn>Order ID</TableColumn>
      </TableHeader>
      <TableBody>
        {orders.data.length ? (
          orders.data.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                {formatDateTime(new Date(order.createdAt)).dateOnly}
              </TableCell>
              <TableCell>{formatPrice(order.totalAmount)}</TableCell>
              <TableCell>
                <NextUiLink
                  href={`${process.env.NEXT_PUBLIC_SERVER_URL}/events/${order.event.id}`}
                  className={"text-sm"}
                  underline={"always"}
                >
                  {order.event.title}
                </NextUiLink>
              </TableCell>
              <TableCell>{order.id}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5}>
              No orders have been placed just yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default EventHistoryTable;
