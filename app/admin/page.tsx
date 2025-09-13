"use client";

import { Card, CardHeader, CardBody } from "@heroui/react";
import { adminDashboardLinks } from "@/app/_lib/constants";
import { useRouter } from "next/navigation";

interface AdminDashboardProps {
  searchParams: Promise<{ search?: string }>;
}

export default function AdminDashboard() {
  const router = useRouter();

  const handleCardClick = (path: string) => {
    router.push(path);
  };

  // Filter out the "Home" link since we're already on the dashboard
  const dashboardCards = adminDashboardLinks.filter(
    (link) => link.path !== "/",
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome to Admin Dashboard
        </h1>
        <p className="text-foreground-500">
          Manage your application data and settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((item) => {
          const IconComponent = item.icon;
          return (
            <Card
              key={item.path}
              isPressable
              isHoverable
              className="p-4 transition-all duration-200 hover:scale-105 cursor-pointer border border-divider hover:shadow-lg"
              onPress={() => handleCardClick(item.path)}
            >
              <CardHeader className="flex flex-col items-center pb-2">
                <div className="p-3 rounded-full bg-primary/10 mb-3">
                  <IconComponent size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {item.name}
                </h3>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="text-sm text-foreground-500 text-center">
                  {getCardDescription(item.name)}
                </p>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function getCardDescription(name: string): string {
  switch (name) {
    case "Events":
      return "Create, edit, and manage all events";
    case "Categories":
      return "Organize events with custom categories";
    case "Users":
      return "Manage user accounts and permissions";
    case "Sync Events":
      return "Synchronize events with external sources";
    default:
      return `Manage ${name.toLowerCase()}`;
  }
}
