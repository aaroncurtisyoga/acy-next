"use client";

import { FC } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderResponse } from "@/app/(root)/account/page";
import TableEmpty from "@/app/_components/TableEmpty";
import {
  EventHistoryTableColumns,
  orderTypeLabels,
} from "@/app/_lib/constants";
import { formatDateTime, formatPrice } from "@/app/_lib/utils";

interface EventHistoryTableProps {
  orders: OrderResponse;
}

const PurchaseHistoryTable: FC<EventHistoryTableProps> = ({ orders }) => {
  if (orders.data.length === 0) {
    return (
      <TableEmpty
        columns={EventHistoryTableColumns}
        message={"We don't" + " have any orders for you just yet"}
      />
    );
  }

  return (
    <Table aria-label="Table for Purchase History">
      <TableHeader>
        <TableRow>
          {EventHistoryTableColumns.map((column) => (
            <TableHead key={column}>{column}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.data.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              {formatDateTime(new Date(order.createdAt)).dateOnly}
            </TableCell>
            <TableCell>{formatPrice(order.totalAmount)}</TableCell>
            <TableCell>
              {order.event?.id ? (
                <Link
                  href={`${process.env.NEXT_PUBLIC_SERVER_URL}/events/${order.event.id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {order.event.title}
                </Link>
              ) : (
                <span className="text-sm text-gray-400">N/A</span>
              )}
            </TableCell>
            <TableCell>{order.id}</TableCell>
            <TableCell>{orderTypeLabels[order.type]}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PurchaseHistoryTable;
