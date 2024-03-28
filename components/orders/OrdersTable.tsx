import React from "react";
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

const OrdersTable = ({ orders }) => {
  return (
    <Table>
      <TableHeader>
        <TableColumn>Order ID</TableColumn>
        <TableColumn>Event Title</TableColumn>
        <TableColumn>Buyer</TableColumn>
        <TableColumn>Created</TableColumn>
        <TableColumn>Amount</TableColumn>
      </TableHeader>
      <TableBody>
        {orders && orders.length === 0 ? (
          <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
        ) : (
          <>
            {orders &&
              orders.map((row: IOrderItem) => (
                <TableRow key={row._id}>
                  <TableCell>{row._id}</TableCell>
                  <TableCell>{row.eventTitle}</TableCell>
                  <TableCell>{row.buyer}</TableCell>
                  <TableCell>
                    {formatDateTime(row.createdAt).dateTime}
                  </TableCell>
                  <TableCell>{formatPrice(row.totalAmount)}</TableCell>
                </TableRow>
              ))}
          </>
        )}
      </TableBody>
    </Table>
  );
};

export default OrdersTable;
