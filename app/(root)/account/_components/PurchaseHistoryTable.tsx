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
import { EventHistoryTableColumns, orderTypeLabels } from "@/_lib/constants";
import TableEmpty from "@/_components/TableEmpty";

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
              <Link
                href={`${process.env.NEXT_PUBLIC_SERVER_URL}/events/${order.event.id}`}
                className={"text-sm text-blue-600 hover:underline"}
              >
                {order.event.title}
              </Link>
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
