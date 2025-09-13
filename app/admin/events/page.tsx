import { FC } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import TableEventManagement from "@/app/admin/events/_components/TableEventManagement";

const AdminEventsPage: FC = () => {
  return (
    <div className="wrapper">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Events</h1>
        <Button
          as={Link}
          href="/admin/events/create"
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          className="font-medium"
        >
          Create Event
        </Button>
      </div>

      <TableEventManagement />
    </div>
  );
};

export default AdminEventsPage;
