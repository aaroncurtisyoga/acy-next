import { Metadata } from "next";
import { getOrdersByEvent } from "@/lib/actions/order.actions";
import { SearchParamProps } from "@/types";
import OrdersTable from "@/components/orders/OrdersTable";

export const metadata: Metadata = {
  title: "Orders",
};

const Orders = async ({ searchParams }: SearchParamProps) => {
  const eventId = (searchParams?.eventId as string) || "";
  const searchText = (searchParams?.query as string) || "";

  const orders = await getOrdersByEvent({ eventId, searchString: searchText });
  console.log("orders", orders);
  return (
    <section className={"py-5 md:py-10"}>
      <h3 className={"wrapper text-center sm:text-left"}>Orders</h3>
      <OrdersTable orders={orders} />
    </section>
  );
};

export default Orders;
