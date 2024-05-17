import Link from "next/link";
import { FC } from "react";
import { Button } from "@nextui-org/react";
import { CirclePlus } from "lucide-react";
import ButtonNewEvent from "@/app/admin/events/_components/ButtonNewEvent";

const AdminEventsPage: FC = () => {
  return (
    <div className={"wrapper"}>
      <h1 className={"text-xl my-5"}>Admin Events Page</h1>
      <ButtonNewEvent />

      <p>events table w/ edit & delete buttons</p>
    </div>
  );
};

export default AdminEventsPage;
