import { checkRole } from "@/lib/utils";
import { redirect } from "next/navigation";

const CreateEvent = () => {
  // If the user does not have the admin role, redirect them to the home page
  if (!checkRole("admin")) {
    redirect("/");
  }

  return (
    <section className={"wrapper"}>
      <p>at submit event page</p>
    </section>
  );
};

export default CreateEvent;
