import { getOrdersByEvent } from "@/app/_lib/actions/order.actions";
import OrdersTable from "@/app/admin/events/orders/_components/OrdersTable";
import AdminPage from "@/app/admin/_components/AdminPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders",
};

interface OrdersPageProps {
  searchParams: Promise<{ eventId?: string; query?: string }>;
}

const Orders = async ({ searchParams }: OrdersPageProps) => {
  const params = await searchParams;
  const eventId = (params?.eventId as string) || "";
  const searchText = (params?.query as string) || "";
  const orders = await getOrdersByEvent({ eventId, searchString: searchText });

  return (
    <AdminPage
      title="Orders"
      description="Registrations and payments across your events."
    >
      <OrdersTable orders={orders} />
    </AdminPage>
  );
};

export default Orders;
