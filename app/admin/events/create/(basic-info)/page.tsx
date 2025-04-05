import { FC } from "react";
import EventFormWrapper from "@/app/admin/events/_components/EventForm/EventFormWrapper";
import BasicInfo from "@/app/admin/events/_components/EventForm/Steps/BasicInfo";

const CreateBasicInfoPage: FC = () => {
  return (
    <section className={"wrapper"}>
      <h1>Create Event</h1>
      <div className={"my-8"}>
        <EventFormWrapper mode="create">
          <BasicInfo />
        </EventFormWrapper>
      </div>
    </section>
  );
};

export default CreateBasicInfoPage;
