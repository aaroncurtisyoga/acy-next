"use client";

import { FC } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TableEventManagement from "@/app/admin/events/_components/TableEventManagement";

const AdminEventsPage: FC = () => {
  return (
    <div className="wrapper">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Events</h1>
        <Button className="font-medium" asChild>
          <Link href="/admin/events/create">
            <Plus className="w-4 h-4" /> Create Event
          </Link>
        </Button>
      </div>

      <TableEventManagement />
    </div>
  );
};

export default AdminEventsPage;
