import { getOrdersByEvent } from "@/_lib/actions/order.actions";
import { SearchParamProps } from "@/_lib/types";
import OrdersTable from "@/app/admin/events/orders/_components/OrdersTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders",
};

const Orders = async ({ searchParams }: SearchParamProps) => {
  const eventId = (searchParams?.eventId as string) || "";
  const searchText = (searchParams?.query as string) || "";
  const orders = await getOrdersByEvent({ eventId, searchString: searchText });

  return (
    <section className={"wrapper py-5 md:py-10 "}>
      <h3 className={"text-xl mb-5"}>Orders</h3>
      <OrdersTable orders={orders} />
    </section>
  );
};

export default Orders;
