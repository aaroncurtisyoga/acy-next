import { Card, CardHeader } from "@/components/ui/card";
import { CalendarX } from "lucide-react";

export default function NoEventsCard() {
  return (
    <Card className="mx-auto text-center bg-slate-50/30 shadow-sm rounded-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <div className="flex-shrink-0">
          <CalendarX className="w-10 h-10 text-primary" size={40} />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Events Scheduled</h3>
        <p className="text-gray-600">
          There aren&apos;t any events scheduled at the moment. Check back soon
          for upcoming yoga sessions and workshops!
        </p>
      </CardHeader>
    </Card>
  );
}
