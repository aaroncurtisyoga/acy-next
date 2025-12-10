"use client";

import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Order, User, Event } from "@prisma/client";
import OrderCard from "@/app/admin/events/orders/_components/OrderCard";
import { formatDateTime, formatPrice } from "@/app/_lib/utils";

type OrderWithEventFieldsAndUserFields = Order & {
  event: Pick<Event, "title">;
  buyer: Pick<User, "firstName" | "lastName">;
};

interface OrdersTableProps {
  orders: OrderWithEventFieldsAndUserFields[];
}
const OrdersTable: FC<OrdersTableProps> = ({ orders }) => {
  if (!orders.length) {
    return (
      <p className="text-default-500 text-center py-8">
        No orders have been placed just yet.
      </p>
    );
  }

  return (
    <>
      {/* Mobile: Cards */}
      <div className="md:hidden space-y-3">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      {/* Desktop: Table */}
      <Table aria-label={"Table for Orders"} className="hidden md:table">
        <TableHeader>
          <TableColumn>Order ID</TableColumn>
          <TableColumn>Event Title</TableColumn>
          <TableColumn>Buyer</TableColumn>
          <TableColumn>Date</TableColumn>
          <TableColumn>Amount</TableColumn>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
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
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default OrdersTable;
