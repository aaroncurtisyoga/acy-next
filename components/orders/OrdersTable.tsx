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
import { Order as PrismaOrder } from "@prisma/client";
import { formatDateTime, formatPrice } from "@/lib/utils";

interface Order extends PrismaOrder {
  event: {
    title: string;
  };
  buyer: {
    firstName: string;
    lastName: string;
  };
}

interface OrdersTableProps {
  orders: Order[];
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
          orders.map((order: Order) => (
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
