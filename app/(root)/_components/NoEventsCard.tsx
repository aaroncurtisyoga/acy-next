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
        <h3 className="italic text-left">
          Nothing on the calendar right this moment. I'll be back with more
          offerings soon!
        </h3>
      </CardHeader>
    </Card>
  );
}
