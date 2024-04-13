"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { IOrder } from "@/lib/mongodb/database/models/order.model";
import { formatDateTime, formatPrice } from "@/lib/utils";

interface OrdersTableProps {
  orders: IOrder[];
}

const OrdersTable = ({ orders }: OrdersTableProps) => {
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
          orders.map((order: IOrder) => (
            <TableRow key={order._id}>
              <TableCell>{order._id}</TableCell>
              <TableCell>{order.event.title}</TableCell>
              <TableCell>{`${order.buyer.firstName} ${order.buyer.lastName}`}</TableCell>
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
