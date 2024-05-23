"use client";

import { useRouter } from "next/navigation";
import { FC } from "react";
import { Link as NextUiLink } from "@nextui-org/link";
import { Button } from "@nextui-org/react";

import { handleError } from "@/_lib/utils";
import { createEvent } from "@/_lib/actions/event.actions";
import { useAppDispatch, useAppSelector } from "@/_lib/redux/hooks";
import {
  selectFormValues,
  resetFormData,
  selectEventType,
} from "@/_lib/redux/features/eventFormSlice";

const SubmitEvent: FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const eventType = useAppSelector(selectEventType);
  const valuesFromRedux = useAppSelector(selectFormValues);

  async function createNewEvent() {
    try {
      const newEvent = await createEvent({
        event: valuesFromRedux,
        path: "/events",
      });

      if (newEvent) {
        dispatch(resetFormData());
        router.push(`/`);
      }
    } catch (error) {
      handleError(error);
    }
  }

  /*  async function updateExistingEvent() {
    try {
      const updatedEvent = await updateEvent({
        // todo: check and see if ID is being saved the right way
        event: { ...valuesFromRedux, _id: valuesFromRedux.id },
        path: `/events/${valuesFromRedux.id}`,
      });

      if (updatedEvent) {
        dispatch(resetFormData());
        redirect(`/events/${updatedEvent._id}`);
      }
    } catch (error) {
      handleError(error);
    }
  }*/

  const onSubmit = async (eventType) => {
    if (eventType === "Create") {
      await createNewEvent();
    }

    /*    if (eventType === "Update") {
      if (event._id) {
        await updateExistingEvent(values);
      } else {
        redirect("/");
      }
    }*/
  };

  return (
    <section className={"wrapper"}>
      <h1>Review Event</h1>
      <form onSubmit={() => onSubmit(eventType)}>
        <div className="flex justify-between mt-5">
          <Button type={"button"}>
            <NextUiLink
              href={"/events/details"}
              className={"text-default-foreground"}
            >
              Previous
            </NextUiLink>
          </Button>
          <Button type={"submit"}>
            {eventType === "Create" ? "Create" : "Update"}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default SubmitEvent;
