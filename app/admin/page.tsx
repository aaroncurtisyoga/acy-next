interface AdminDashboardProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function AdminDashboard(
  _props: AdminDashboardProps, // Unused searchParams - for future search functionality
) {
  // const params = await searchParams; // Unused - for future search functionality
  return <div className={"wrapper"}></div>;
}
