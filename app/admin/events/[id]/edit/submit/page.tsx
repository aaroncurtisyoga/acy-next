"use client";

import { redirect, useRouter } from "next/navigation";
import { FC } from "react";
import { Link as NextUiLink } from "@nextui-org/link";
import { Button } from "@nextui-org/react";

import { handleError } from "@/_lib/utils";
import { updateEvent } from "@/_lib/actions/event.actions";
import { useAppDispatch, useAppSelector } from "@/_lib/redux/hooks";
import {
  selectFormValues,
  resetFormData,
} from "@/_lib/redux/features/eventFormSlice";

const SubmitEvent: FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const valuesFromRedux = useAppSelector(selectFormValues);

  /*
  async function updateExistingEvent() {
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
  }

  const onSubmit = async (eventType) => {
    if (event._id) {
      await updateExistingEvent(values);
    } else {
      redirect("/");
    }
  };
*/

  return (
    <section className={"wrapper"}>
      <h1>Review Event</h1>
      {/* <form onSubmit={() => onSubmit(eventType)}>
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
      </form>*/}
    </section>
  );
};

export default SubmitEvent;
