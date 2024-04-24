import { redirect } from "next/navigation";
import { FC } from "react";
import BasicInfo from "@/components/events/EventForm/Steps/BasicInfo";
import { checkRole } from "@/lib/utils";

const CreateEvent: FC = () => {
  if (!checkRole("admin")) {
    redirect("/");
  }

  return (
    <section className={"wrapper"}>
      <h1>Create Event</h1>
      <div className={"my-8"}>
        <BasicInfo type={"Create"} />
      </div>
    </section>
  );
};

export default CreateEvent;
