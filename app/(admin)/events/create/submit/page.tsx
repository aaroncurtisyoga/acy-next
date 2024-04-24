import { redirect } from "next/navigation";
import { FC } from "react";
import * as z from "zod";
import { Link as NextUiLink } from "@nextui-org/link";
import { Button } from "@nextui-org/react";

import { checkRole, handleError } from "@/lib/utils";
import { createEvent, updateEvent } from "@/lib/actions/event.actions";
import { IEvent } from "@/lib/mongodb/database/models/event.model";

type Inputs = z.infer<typeof EventFormSchema>;
type FieldName = keyof Inputs;

interface CreateEventProps {
  event?: IEvent;
  type: "Create" | "Update";
}

const CreateEvent: FC<CreateEventProps> = ({ event, type }) => {
  if (!checkRole("admin")) {
    redirect("/");
  }

  async function createNewEvent(values: z.infer<typeof EventFormSchema>) {
    try {
      const newEvent = await createEvent({ event: values, path: "/events" });

      if (newEvent) {
        reset();
        values.isHostedExternally
          ? router.push(`/`)
          : router.push(`/events/${newEvent._id}`);
      }
    } catch (error) {
      handleError(error);
    }
  }

  async function updateExistingEvent(values: z.infer<typeof EventFormSchema>) {
    try {
      const updatedEvent = await updateEvent({
        event: { ...values, _id: event._id },
        path: `/events/${event._id}`,
      });

      if (updatedEvent) {
        reset();
        router.push(`/events/${updatedEvent._id}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onSubmit = async (values: z.infer<typeof EventFormSchema>) => {
    if (type === "Create") {
      await createNewEvent(values);
    }

    if (type === "Update") {
      if (event._id) {
        await updateExistingEvent(values);
      } else {
        router.back();
      }
    }
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

export default CreateEvent;
