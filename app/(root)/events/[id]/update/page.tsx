import React, { FC } from "react";
import { redirect } from "next/navigation";
import { checkRole } from "@/lib/utils";
import BasicInfo from "@/components/events/EventForm/Steps/BasicInfo";
import { getEventById } from "@/lib/actions/event.actions";
import { IEvent } from "@/lib/mongodb/database/models/event.model";

type UpdateEventProps = {
  params: {
    id: string;
  };
};

const UpdateEvent: FC<UpdateEventProps> = async ({ params: { id } }) => {
  // If the user does not have the admin role, redirect them to the home page
  if (!checkRole("admin")) {
    redirect("/");
  }

  const event: IEvent = await getEventById(id);
  // todo: store event in state

  return (
    <section className={"wrapper"}>
      <h1>Update Event</h1>
      <div>
        <BasicInfo type={"Update"} event={event} />
      </div>
    </section>
  );
};

export default UpdateEvent;
