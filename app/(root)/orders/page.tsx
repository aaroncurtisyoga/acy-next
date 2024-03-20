import { Metadata } from "next";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { getOrdersByEvent } from "@/lib/actions/order.actions";
import { formatDateTime, formatPrice } from "@/lib/utils";
import { SearchParamProps } from "@/types";
import { IOrderItem } from "@/lib/mongodb/database/models/order.model";

export const metadata: Metadata = {
  title: "Orders",
};
const Orders = async ({ searchParams }: SearchParamProps) => {
  const eventId = (searchParams?.eventId as string) || "";
  const searchText = (searchParams?.query as string) || "";

  const orders = await getOrdersByEvent({ eventId, searchString: searchText });
  return (
    <>
      <section
        className={
          "bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10"
        }
      >
        <h3 className={"wrapper text-center sm:text-left"}>Orders</h3>
      </section>
      <section className="wrapper mt-8">
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
      </section>
    </>
  );
};

export default Orders;
