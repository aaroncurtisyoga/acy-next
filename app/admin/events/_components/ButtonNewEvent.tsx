import { FC } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { CirclePlus } from "lucide-react";

const ButtonNewEvent: FC = () => {
  return (
    <Button startContent={<CirclePlus />}>
      <Link href={"/admin/events/create"}>New</Link>
    </Button>
  );
};

export default ButtonNewEvent;
