import Offering from "@/components/shared/Offering";
import { locations, signUpLinks } from "@/constants";

const Page = () => {
  return (
    <section className={"p-8"}>
      <h1 className={"text-3xl mb-8"}>Weekly Schedule</h1>
      <div className={"mb-6"}>
        <p className={"text-xl"}>Monday</p>
        <Offering
          link={signUpLinks.dcBoulderingProject}
          time={"6:30am"}
          name={"Power Flow"}
          location={locations.BOULDERING_PROJECT}
        />
      </div>
      <div className={"mb-6"}>
        <p className={"text-xl"}>Friday</p>
        <Offering
          link={signUpLinks.dcBoulderingProject}
          time={"6:30am"}
          name={"Power Flow"}
          location={locations.BOULDERING_PROJECT}
        />
      </div>
      <div className={"mb-6"}>
        <p className={"text-xl"}>Sunday</p>
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
