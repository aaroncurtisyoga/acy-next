import React from "react";
import classes from "./schedule.module.scss";
import Offering from "./offering";

const Schedule = () => {
  const dcBoulderingProject =
    "https://www.dcboulderingproject.com/yoga-fitness";
  const crossFitDcLink = "https://crossfitdc.com/";

  const locations = {
    BOULDERING_PROJECT: "Bouldering Project",
    CROSSFIT_DC: "CrossFit DC",
  };
  return (
    <section className={classes.scheduleSection}>
      <h1>Weekly Classes</h1>
      <div>
        <p className={classes.day}>Monday</p>
        <Offering
          link={dcBoulderingProject}
          time={"6:30am"}
          name={"Power Flow"}
          location={locations.BOULDERING_PROJECT}
        />
      </div>
      <div>
        <p className={classes.day}>Tuesday</p>
        <Offering
          link={dcBoulderingProject}
          time={"6:30am"}
          name={"Flow"}
          location={locations.BOULDERING_PROJECT}
        />
      </div>
      <div>
        <p className={classes.day}>
          <s>Wednesday</s>
        </p>
      </div>
      <div>
        <p className={classes.day}>Thursday</p>
        <Offering
          link={dcBoulderingProject}
          time={"6:30am"}
          name={"Flow"}
          location={locations.BOULDERING_PROJECT}
        />
        <Offering
          link={dcBoulderingProject}
          time={"12:00pm"}
          name={"Flow"}
          location={locations.BOULDERING_PROJECT}
        />
      </div>

      <div>
        <p className={classes.day}>Friday</p>
        <Offering
          link={dcBoulderingProject}
          time={"6:30am"}
          name={"Power Flow"}
          location={locations.BOULDERING_PROJECT}
        />
      </div>
      <div>
        <p className={classes.day}>
          <s>Saturday</s>
        </p>
      </div>
      <div>
        <p className={classes.day}>Sunday</p>
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

export default Schedule;
