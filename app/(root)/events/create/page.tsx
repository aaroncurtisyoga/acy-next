import EventForm from "@/components/events/EventForm";
import { checkRole } from "@/lib/utils";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

const CreateEvent = () => {
  // If the user does not have the admin role, redirect them to the home page
  if (!checkRole("admin")) {
    redirect("/");
  }
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  return (
    <section className={"wrapper"}>
      <h3>Create Event</h3>
      <div className={"my-8"}>
        <EventForm type={"Create"} />
      </div>
    </section>
  );
};

export default CreateEvent;
