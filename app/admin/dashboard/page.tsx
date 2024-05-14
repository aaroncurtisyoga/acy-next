import ManageEventCategories from "@/components/admin/ManageEventCategories";
import CreateEventButton from "@/components/shared/CreateEventButton";

export default async function AdminDashboard(params: {
  searchParams: { search?: string };
}) {
  const query = params.searchParams.search;

  return (
    <div className={"wrapper"}>
      <h1 className={"text-large"}>Admin Dashboard</h1>
      <hr className={"my-6"} />
      <ManageEventCategories />
      <hr className={"my-6"} />
      <CreateEventButton />
    </div>
  );
}
