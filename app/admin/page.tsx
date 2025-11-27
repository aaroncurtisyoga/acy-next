"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { adminDashboardLinks } from "@/app/_lib/constants";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();

  const handleCardClick = (path: string) => {
    router.push(path);
  };

  // Show all admin links as cards
  const dashboardCards = adminDashboardLinks;

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
              isHoverable
              className="p-4 transition-all duration-200 cursor-pointer border border-divider hover:shadow-lg relative flex flex-col h-full"
              onClick={() => handleCardClick(item.path)}
            >
              <CardHeader className="flex flex-col items-center pb-2">
                <div className="p-3 rounded-full bg-primary/10 mb-3">
                  <IconComponent size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {item.name}
                </h3>
              </CardHeader>
              <CardBody className="pt-0 flex flex-col flex-grow">
                <p className="text-sm text-foreground-500 text-center mb-3 flex-grow">
                  {getCardDescription(item.name)}
                </p>
                {(item.name === "Events" || item.name === "Categories") && (
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    startContent={<Plus size={16} />}
                    className="w-full mt-auto"
                    onPress={(e) => {
                      e.continuePropagation?.();
                      router.push(
                        item.name === "Events"
                          ? "/admin/events/create"
                          : "/admin/categories/create",
                      );
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    New
                  </Button>
                )}
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
    case "Main Site":
      return "Go back to the main website";
    default:
      return `Manage ${name.toLowerCase()}`;
  }
}
