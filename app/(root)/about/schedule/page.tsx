import Offering from "@/components/shared/Offering";
import { locations, signUpLinks } from "@/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schedule",
};
const Page = () => {
  return (
    <section className={"wrapper"}>
      <h1 className={"text-3xl mb-8"}>Weekly Schedule</h1>
      <div className={"mb-6"}>
        <p className={"text-xl"}>Monday</p>
        <hr className={"md:hidden"} />
        <Offering
          link={signUpLinks.dcBoulderingProject}
          time={"6:30am"}
          name={"Power Flow"}
          location={locations.BOULDERING_PROJECT}
        />
      </div>

      <div className={"mb-6"}>
        <p className={"text-xl"}>Friday</p>
        <hr className={"md:hidden"} />
        <Offering
          link={signUpLinks.dcBoulderingProject}
          time={"6:30am"}
          name={"Power Flow"}
          location={locations.BOULDERING_PROJECT}
        />
      </div>

      <div>
        <p className={"text-xl"}>Sunday</p>
        <hr className={"md:hidden"} />
        <Offering
          link={signUpLinks.crossFitDc}
          time={"2:00pm"}
          name={"Flexibility/Mobility"}
          location={locations.CROSSFIT_DC}
        />
      </div>
    </section>
  );
};

export default Page;