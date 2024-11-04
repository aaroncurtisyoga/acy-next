import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { CalendarX } from "lucide-react";

export default function NoEventsCard() {
  return (
    <Card className="mx-auto text-center p-6 mt-2 shadow-md">
      <CardHeader className="flex items-center">
        <CalendarX className="w-10 h-10 text-primary-900 mr-3" />
        <h3 className="text-primary-900 italic">
          No events scheduled at the moment
        </h3>
      </CardHeader>
      <CardBody className="py-3">
        <p>
          I don&apos;t have any events scheduled at the moment, but I&apos;m
          looking forward to getting some scheduled soon. Please check back for
          updates or sign up for the newsletter.
        </p>
      </CardBody>
    </Card>
  );
}
