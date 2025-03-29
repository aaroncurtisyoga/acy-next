"use client";

import { FC, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { Link as HeroUiLink } from "@heroui/react";
import { createEvent } from "@/app/_lib/actions/event.actions";
import {
  selectFormValues,
  resetFormData,
} from "@/app/_lib/redux/features/eventFormSlice";
import { useAppDispatch, useAppSelector } from "@/app/_lib/redux/hooks";
import { handleError } from "@/app/_lib/utils";

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
            <HeroUiLink
              href={"/events/details"}
              className={"text-default-foreground"}
            >
              Previous
            </HeroUiLink>
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
