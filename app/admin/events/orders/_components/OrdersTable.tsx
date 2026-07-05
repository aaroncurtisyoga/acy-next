"use client";

import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order, User, Event } from "@prisma/client";
import { ShoppingBag } from "lucide-react";
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
      <div className="py-8 text-center text-muted-foreground">
        <ShoppingBag className="mx-auto mb-3 h-12 w-12 text-muted-foreground/60" />
        <p>No orders have been placed just yet.</p>
      </div>
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
      <div className="hidden md:block">
        <Table aria-label="Table for Orders">
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Event Title</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
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
      </div>
    </>
  );
};

export default OrdersTable;
