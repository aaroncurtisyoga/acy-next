import { checkRole } from "@/lib/utils";
import { redirect } from "next/navigation";
import Details from "@/components/events/EventForm/Steps/DetailsForInternallyHostedEvent";

const CreateEvent = () => {
  // If the user does not have the admin role, redirect them to the home page
  if (!checkRole("admin")) {
    redirect("/");
  }
  return (
    <section className={"wrapper"}>
      <h1>Create Event</h1>
      <div className={"my-8"}>
        {/* Every event has basic info */}
        <Details type={"Create"} />
      </div>
    </section>
  );
};

export default CreateEvent;
