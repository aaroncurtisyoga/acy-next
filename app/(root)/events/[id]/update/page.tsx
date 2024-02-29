import { redirect } from "next/navigation";
import Index from "@/components/events/EventForm";
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
      <h1>Update Event</h1>
      <div>
        <Index type={"Update"} event={event} />
      </div>
    </section>
  );
};

export default UpdateEvent;
