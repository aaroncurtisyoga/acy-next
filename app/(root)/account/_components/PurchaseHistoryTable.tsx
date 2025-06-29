"use client";

import { FC } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
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
    <Table aria-label={"Table for Purchase History"}>
      <TableHeader>
        {EventHistoryTableColumns.map((column) => (
          <TableColumn key={column}>{column}</TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {orders.data.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              {formatDateTime(new Date(order.createdAt)).dateOnly}
            </TableCell>
            <TableCell>{formatPrice(order.totalAmount)}</TableCell>
            <TableCell>
              {/* Todo: Replace w/ Next UI link */}
              {order.event?.id ? (
                <Link
                  href={`${process.env.NEXT_PUBLIC_SERVER_URL}/events/${order.event.id}`}
                  className={"text-sm text-blue-600 hover:underline"}
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
