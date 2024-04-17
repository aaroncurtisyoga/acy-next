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
import { IOrderItem } from "@/lib/mongodb/database/models/order.model";
import { formatDateTime, formatPrice } from "@/lib/utils";

interface OrdersTableProps {
  orders: IOrderItem[];
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
          orders.map((order: IOrderItem) => (
            <TableRow key={order._id}>
              <TableCell>{order._id}</TableCell>
              <TableCell>{order.eventTitle}</TableCell>
              <TableCell>{order.buyer}</TableCell>
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
