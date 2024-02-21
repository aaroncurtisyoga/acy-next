import Search from "@/components/shared/Search";
import { getOrdersByEvent } from "@/lib/actions/order.actions";
import { formatDateTime, formatPrice } from "@/lib/utils";
import { SearchParamProps } from "@/types";
import { IOrderItem } from "@/lib/mongodb/database/models/order.model";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders",
};
const Orders = async ({ searchParams }: SearchParamProps) => {
  const eventId = (searchParams?.eventId as string) || "";
  const searchText = (searchParams?.query as string) || "";

  const orders = await getOrdersByEvent({ eventId, searchString: searchText });
  return (
    <>
      <section>
        <h3>Orders</h3>
      </section>
      <section>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Event Title</th>
              <th>Buyer</th>
              <th>Created</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length === 0 ? (
              <tr>
                <td colSpan={5}>No orders found.</td>
              </tr>
            ) : (
              <>
                {orders &&
                  orders.map((row: IOrderItem) => (
                    <tr key={row._id} style={{ boxSizing: "border-box" }}>
                      <td>{row._id}</td>
                      <td>{row.eventTitle}</td>
                      <td>{row.buyer}</td>
                      <td>{formatDateTime(row.createdAt).dateTime}</td>
                      <td>{formatPrice(row.totalAmount)}</td>
                    </tr>
                  ))}
              </>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default Orders;
