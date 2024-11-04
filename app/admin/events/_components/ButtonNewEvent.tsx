import { FC } from "react";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import { CirclePlus } from "lucide-react";

const ButtonNewEvent: FC = () => {
  return (
    <Button startContent={<CirclePlus />}>
      <Link href={"/admin/events/new"}>New</Link>
    </Button>
  );
};

export default ButtonNewEvent;
