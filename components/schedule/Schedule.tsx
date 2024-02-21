import { locations, signUpLinks } from "@/constants";
import { Metadata } from "next";
import Offering from "@/components/schedule/Offering";

export const metadata: Metadata = {
  title: "Schedule",
};
const Schedule = () => {
  return (
    <section>
      <h1>Weekly Schedule</h1>
      <div>
        <p>Monday</p>
        <Offering
          link={signUpLinks.dcBoulderingProject}
          time={"6:30am"}
          name={"Power Flow"}
          location={locations.BOULDERING_PROJECT}
        />
      </div>

      <div>
        <p>Friday</p>
        <Offering
          link={signUpLinks.dcBoulderingProject}
          time={"6:30am"}
          name={"Power Flow"}
          location={locations.BOULDERING_PROJECT}
        />
      </div>

      <div>
        <p>Sunday</p>
        <hr />
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

export default Schedule;
