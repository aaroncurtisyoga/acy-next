"use client";

import { redirect } from "next/navigation";
import { FC } from "react";
import * as z from "zod";
import { Link as NextUiLink } from "@nextui-org/link";
import { Button } from "@nextui-org/react";

import { checkRole, handleError } from "@/lib/utils";
import { createEvent, updateEvent } from "@/lib/actions/event.actions";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  selectFormValues,
  resetFormData,
} from "@/lib/redux/features/eventFormSlice";

interface SubmitEventProps {
  type: "Create" | "Update";
}

const SubmitEvent: FC<SubmitEventProps> = ({ type }) => {
  const dispatch = useAppDispatch();
  const valuesFromRedux = useAppSelector(selectFormValues);

  async function createNewEvent() {
    try {
      const newEvent = await createEvent({
        event: valuesFromRedux,
        path: "/events",
      });

      if (newEvent) {
        dispatch(resetFormData());
        redirect(`/`);
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

  const onSubmit = async () => {
    if (type === "Create") {
      await createNewEvent();
    }

    /*    if (type === "Update") {
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
      <form onSubmit={() => onSubmit}>
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
            {type === "Create" ? "Create" : "Update"}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default SubmitEvent;
