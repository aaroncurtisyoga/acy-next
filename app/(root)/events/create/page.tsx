import { checkRole } from "@/lib/utils";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import EventForm from "@/components/events/EventForm";

const CreateEvent = () => {
  // If the user does not have the admin role, redirect them to the home page
  if (!checkRole("admin")) {
    redirect("/");
  }
  const { sessionClaims } = auth();
  return (
    <section className={"wrapper"}>
      <h1>Create Event</h1>
      <div className={"my-8"}>
        <EventForm type={"Create"} />
      </div>
    </section>
  );
};

export default CreateEvent;
