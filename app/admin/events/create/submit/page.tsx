"use client";

import { FC, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Link as NextUiLink } from "@nextui-org/link";
import { Button } from "@nextui-org/react";
import { createEvent } from "@/_lib/actions/event.actions";
import {
  selectFormValues,
  resetFormData,
} from "@/_lib/redux/features/eventFormSlice";
import { useAppDispatch, useAppSelector } from "@/_lib/redux/hooks";
import { handleError } from "@/_lib/utils";

const SubmitEvent: FC = () => {
  const router = useRouter();
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
        router.push(`/`);
      }
    } catch (error) {
      handleError(error);
    }
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createNewEvent();
  };

  return (
    <section className={"wrapper"}>
      <h1>Review Event</h1>
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="flex justify-between mt-5">
          <Button type={"button"}>
            <NextUiLink
              href={"/events/details"}
              className={"text-default-foreground"}
            >
              Previous
            </NextUiLink>
          </Button>
          <Button type={"submit"} color={"primary"}>
            Create Event
          </Button>
        </div>
      </form>
    </section>
  );
};

export default SubmitEvent;
