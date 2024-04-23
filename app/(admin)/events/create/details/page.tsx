import { checkRole } from "@/lib/utils";
import { redirect } from "next/navigation";
import DetailsForInternallyHostedEvent from "@/components/events/EventForm/Steps/DetailsForInternallyHostedEvent";
import DetailsForExternallyHostedEvent from "@/components/events/EventForm/Steps/DetailsForExternallyHostedEvent";
import { useAppSelector } from "@/lib/redux/hooks";
import { selectIsHostedExternally } from "@/lib/redux/features/eventFormSlice";

const CreateEvent = () => {
  const isHostedExternally = useAppSelector(selectIsHostedExternally);

  // If the user does not have the admin role, redirect them to the home page
  if (!checkRole("admin")) {
    redirect("/");
  }

  return (
    <section className={"wrapper"}>
      <h1>Create Event</h1>
      <div className={"my-8"}>
        {isHostedExternally ? (
          <DetailsForExternallyHostedEvent type={"Create"} />
        ) : (
          <DetailsForInternallyHostedEvent type={"Create"} />
        )}
      </div>
    </section>
  );
};

export default CreateEvent;
