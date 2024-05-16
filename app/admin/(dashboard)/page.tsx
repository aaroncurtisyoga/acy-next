import Link from "next/link";

export default async function AdminDashboard(params: {
  searchParams: { search?: string };
}) {
  return (
    <div className={"wrapper"}>
      <ul>
        <Link href="/admin/events">Events</Link>
        <Link href="/admin/events">Categories</Link>
      </ul>
    </div>
  );
}
