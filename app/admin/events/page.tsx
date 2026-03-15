"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, List, CalendarDays } from "lucide-react";
import TableEventManagement from "@/app/admin/events/_components/TableEventManagement";
import CalendarEventManagement from "@/app/admin/events/_components/CalendarEventManagement";

const AdminEventsPage: FC = () => {
  const [view, setView] = useState<"list" | "calendar">("calendar");

  return (
    <div className="wrapper">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Events</h1>
        <div className="flex items-center gap-3">
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as "list" | "calendar")}
          >
            <TabsList>
              <TabsTrigger value="list" className="gap-1.5">
                <List className="h-4 w-4" /> List
              </TabsTrigger>
              <TabsTrigger value="calendar" className="gap-1.5">
                <CalendarDays className="h-4 w-4" /> Calendar
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button className="font-medium" asChild>
            <Link href="/admin/events/create">
              <Plus className="w-4 h-4" /> Create Event
            </Link>
          </Button>
        </div>
      </div>

      {view === "list" ? <TableEventManagement /> : <CalendarEventManagement />}
    </div>
  );
};

export default AdminEventsPage;
