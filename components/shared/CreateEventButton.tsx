import Link from "next/link";
import { Button } from "@nextui-org/react";
import { PlusCircle } from "lucide-react";

const CreateEventButton = () => {
  return (
    <Link href={"/events/create"}>
      <Button color="default" startContent={<PlusCircle />}>
        New Event
      </Button>
    </Link>
  );
};

export default CreateEventButton;
