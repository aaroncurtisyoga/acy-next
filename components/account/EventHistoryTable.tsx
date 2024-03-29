"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { IOrderItem } from "@/lib/mongodb/database/models/order.model";
import { formatDateTime, formatPrice } from "@/lib/utils";

const EventHistoryTable = ({ orders }) => {
  return (
    <Table>
      <TableHeader>
        <TableColumn>Date</TableColumn>
        <TableColumn>Amount</TableColumn>
        <TableColumn>Event</TableColumn>
        <TableColumn>Buyer</TableColumn>
        <TableColumn>Order ID</TableColumn>
      </TableHeader>
      <TableBody>
        {orders.length ? (
          orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>
                {formatDateTime(new Date(order.createdAt)).dateOnly}
              </TableCell>
              <TableCell>{formatPrice(order.totalAmount)}</TableCell>
              <TableCell>
                <a
                  href={`${process.env.NEXT_PUBLIC_SERVER_URL}/events/${order.event._id}`}
                >
                  {order.eventTitle}
                </a>
              </TableCell>
              <TableCell>{order.buyer}</TableCell>
              <TableCell>{order._id}</TableCell>
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
