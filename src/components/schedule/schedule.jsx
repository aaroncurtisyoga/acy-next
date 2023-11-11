import React from "react";
import classes from "./schedule.module.scss";
import Offering from "./offering";

const Schedule = () => {
  const dcBoulderingProject =
    "https://www.dcboulderingproject.com/yoga-fitness";
  const yogaDistrictLink = "https://www.bit.ly/yogadistrictaaron";
  const crossFitDcLink = "https://crossfitdc.com/";

  const locations = {
    BOULDERING_PROJECT: "Bouldering Project",
    YOGA_DISTRICT_H: "Yoga District @ H",
    YOGA_DISTRICT_U: "Yoga District @ 14th",
    CROSSFIT_DC: "CrossFit DC",
  };
  return (
    <section className={classes.scheduleSection}>
      <div>
        <p className={classes.day}>Monday</p>
        <Offering
          link={dcBoulderingProject}
          time={"6:30am"}
          name={"Power Flow"}
          location={locations.BOULDERING_PROJECT}
        />
        <Offering
          link={yogaDistrictLink}
          time={"5:15pm"}
          name={"Power Flow"}
          location={locations.YOGA_DISTRICT_H}
        />
      </div>
      <br />

      <div>
        <p className={classes.day}>Tuesday</p>
        <Offering
          link={dcBoulderingProject}
          time={"6:30am"}
          name={"Flow"}
          location={locations.BOULDERING_PROJECT}
        />
        <Offering
          link={yogaDistrictLink}
          time={"5:15pm"}
          name={"Power Flow"}
          location={locations.YOGA_DISTRICT_U}
        />
      </div>
      <br />

      <div className={classes.day}>
        <p className={classes.day}>Thursday</p>
        <Offering
          link={dcBoulderingProject}
          time={"6:30am"}
          name={"Flow"}
          location={locations.BOULDERING_PROJECT}
        />
      </div>
      <br />

      <div>
        <p className={classes.day}>Friday</p>
        <Offering
          link={dcBoulderingProject}
          time={"6:30am"}
          name={"Power Flow"}
          location={locations.BOULDERING_PROJECT}
        />
      </div>
      <br />

      <div>
        <p className={classes.day}>Saturday</p>
        <Offering
          link={yogaDistrictLink}
          time={"10:30am"}
          name={"Power Flow"}
          location={locations.YOGA_DISTRICT_H}
        />
      </div>
      <br />

      <div className={classes.day}>
        <p className={classes.day}>Sunday</p>
        <Offering
          link={yogaDistrictLink}
          time={"10:45am"}
          name={"Power Flow"}
          location={locations.YOGA_DISTRICT_U}
        />
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
