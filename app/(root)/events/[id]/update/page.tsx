import { redirect } from "next/navigation";
import EventForm from "@/components/events/EventForm/EventForm";
import { checkRole } from "@/lib/utils";
import { getEventById } from "@/lib/actions/event.actions";

type UpdateEventProps = {
  params: {
    id: string;
  };
};
const UpdateEvent = async ({ params: { id } }: UpdateEventProps) => {
  // If the user does not have the admin role, redirect them to the home page
  if (!checkRole("admin")) {
    redirect("/");
  }

  const event = await getEventById(id);
  return (
    <section className={"wrapper"}>
      <h3>Update Event</h3>
      <div className={" my-8"}>
        <EventForm type={"Update"} event={event} />
      </div>
    </section>
  );
};

export default UpdateEvent;
