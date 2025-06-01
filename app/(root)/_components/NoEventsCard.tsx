import { Card, CardHeader } from "@heroui/react";
import { CalendarX } from "lucide-react";

export default function NoEventsCard() {
  return (
    <Card
      className="mx-auto text-center bg-slate-50/30"
      shadow="sm"
      radius="sm"
      isHoverable
    >
      <CardHeader className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <CalendarX className="w-10 h-10 text-primary-900" size={40} />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Events Scheduled</h3>
        <p className="text-gray-600">
          There aren&apos;t any events scheduled at the moment. Check back soon for
          upcoming yoga sessions and workshops!
        </p>
      </CardHeader>
    </Card>
  );
}
