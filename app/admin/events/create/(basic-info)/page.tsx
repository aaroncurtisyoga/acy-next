import { FC } from "react";
import BasicInfo from "@/app/admin/events/_components/EventForm/Steps/BasicInfo";

const CreateEvent: FC = () => {
  return (
    <section className={"wrapper"}>
      <h1>Create Event</h1>
      <div className={"my-8"}>
        <BasicInfo />
      </div>
    </section>
  );
};

export default CreateEvent;
