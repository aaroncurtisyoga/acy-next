import Link from "next/link";
import { adminDashboardLinks } from "@/constants";
import { Button, link } from "@nextui-org/react";

export default async function AdminDashboard(params: {
  searchParams: { search?: string };
}) {
  return (
    <div className={"wrapper"}>
      <ul>
        {adminDashboardLinks.map((link) => (
          <Button key={link.path} className={"mr-2"}>
            <Link href={link.path}>{link.name}</Link>
          </Button>
        ))}
      </ul>
    </div>
  );
}
