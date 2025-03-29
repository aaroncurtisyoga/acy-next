import { Card, CardBody, CardHeader } from "@heroui/card";
import { CalendarX } from "lucide-react";

export default function NoEventsCard() {
  return (
    <Card className="mx-auto text-center p-6 shadow-md bg-slate-50/30">
      <CardHeader className="flex">
        <CalendarX className="w-10 h-10 text-primary-900 mr-3" />
        <h3 className="text-primary-900 italic text-left">
          Nothing on the calendar right this moment
        </h3>
      </CardHeader>
      <CardBody className="py-3">
        <p>
          <span className="text-xl">🙂</span> Hey, thanks for dropping by. I
          don&lsquo;t have any events scheduled right this moment, but
          I&lsquo;ll be back with more offerings soon
        </p>
        <p className={"mt-2"}>
          <span className="text-xl">📬</span> If you want to get notifications
          sent right to your inbox, there&lsquo;s the option to sign up for my
          newsletter right at the bottom of this page
        </p>
        <p className={"mt-2"}>
          <span className="text-xl">✨</span> I hope this day finds you in
          happiness and health. And I look forward to practicing with you soon!
        </p>
      </CardBody>
    </Card>
  );
}
