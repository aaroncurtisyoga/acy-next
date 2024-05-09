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
import { Order, User, Event } from "@prisma/client";
import { formatDateTime, formatPrice } from "@/lib/utils";

type OrderWithEventFieldsAndUserFields = Order & {
  event: Pick<Event, "title">;
  buyer: Pick<User, "firstName" | "lastName">;
};

interface OrdersTableProps {
  orders: OrderWithEventFieldsAndUserFields[];
}
const OrdersTable: FC<OrdersTableProps> = ({ orders }) => {
  return (
    <Table aria-label={"Table for Orders"}>
      <TableHeader>
        <TableColumn>Order ID</TableColumn>
        <TableColumn>Event Title</TableColumn>
        <TableColumn>Buyer</TableColumn>
        <TableColumn>Date</TableColumn>
        <TableColumn>Amount</TableColumn>
      </TableHeader>
      <TableBody>
        {orders.length ? (
          orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.event.title}</TableCell>
              <TableCell>
                {order.buyer.firstName} {order.buyer.lastName}
              </TableCell>
              <TableCell>
                {formatDateTime(new Date(order.createdAt)).dateOnly}
              </TableCell>
              <TableCell>{formatPrice(order.totalAmount)}</TableCell>
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

export default OrdersTable;
