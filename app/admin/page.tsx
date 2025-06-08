interface AdminDashboardProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function AdminDashboard({
  searchParams,
}: AdminDashboardProps) {
  const params = await searchParams;
  return <div className={"wrapper"}></div>;
}
