"use client";

import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { formatDateTime, formatPrice } from "@/_lib/utils";
import { OrderResponse } from "@/app/(root)/account/page";
import Link from "next/link";

interface EventHistoryTableProps {
  orders: OrderResponse;
}
const EventHistoryTable: FC<EventHistoryTableProps> = ({ orders }) => {
  const hasOrders = orders.data.length > 0;
  return (
    <Table aria-label={"Table for Event Purchase History"}>
      <TableHeader>
        <TableColumn>Date</TableColumn>
        <TableColumn>Amount</TableColumn>
        <TableColumn>Event</TableColumn>
        <TableColumn>Order ID</TableColumn>
      </TableHeader>
      {hasOrders ? (
        <TableBody>
          {orders.data.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                {formatDateTime(new Date(order.createdAt)).dateOnly}
              </TableCell>
              <TableCell>{formatPrice(order.totalAmount)}</TableCell>
              <TableCell>
                {/* Todo: Replace w/ Next UI link */}
                <Link
                  href={`${process.env.NEXT_PUBLIC_SERVER_URL}/events/${order.event.id}`}
                  className={"text-sm text-blue-600 hover:underline"}
                >
                  {order.event.title}
                </Link>
              </TableCell>
              <TableCell>{order.id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      ) : (
        <TableBody emptyContent={"No orders have been placed just yet."}>
          {[]}
        </TableBody>
      )}
    </Table>
  );
};

export default EventHistoryTable;
