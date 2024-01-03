import React from "react";
import Offering from "../ui/schedule/offering";

const Page = () => {
  const dcBoulderingProject =
    "https://www.dcboulderingproject.com/yoga-fitness";
  const crossFitDcLink = "https://crossfitdc.com/";

  const locations = {
    BOULDERING_PROJECT: "Bouldering Project",
    CROSSFIT_DC: "CrossFit DC",
  };
  return (
    <section>
      <h1>Weekly Classes</h1>
      <div>
        <p>Monday</p>
        <Offering
          link={dcBoulderingProject}
          time={"6:30am"}
          name={"Power Flow"}
          location={locations.BOULDERING_PROJECT}
        />
      </div>
      <div>
        <p>Tuesday</p>
        <Offering
          link={dcBoulderingProject}
          time={"6:30am"}
          name={"Flow"}
          location={locations.BOULDERING_PROJECT}
        />
      </div>
      <div>
        <p>
          <s>Wednesday</s>
        </p>
      </div>
      <div>
        <p>Thursday</p>
        <Offering
          link={dcBoulderingProject}
          time={"6:30am"}
          name={"Flow"}
          location={locations.BOULDERING_PROJECT}
        />
      </div>

      <div>
        <p>Friday</p>
        <Offering
          link={dcBoulderingProject}
          time={"6:30am"}
          name={"Power Flow"}
          location={locations.BOULDERING_PROJECT}
        />
      </div>
      <div>
        <p>
          <s>Saturday</s>
        </p>
      </div>
      <div>
        <p>Sunday</p>
        <Offering
          link={crossFitDcLink}
          time={"2:00pm"}
          name={"Flexibility/Mobility"}
          location={locations.CROSSFIT_DC}
        />
      </div>
    </section>
  );
};

export default Page;
