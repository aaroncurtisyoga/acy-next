import React from "react";
import classes from "./schedule.module.scss";

/* Todo:
 *   1) Check w/ Google/Material and see if there's better way to display
 *  list of classes
 * */

const Schedule = () => {
  const dcBoulderingProject =
    "https://www.dcboulderingproject.com/yoga-fitness";
  const yogaDistrictLink = "https://www.bit.ly/yogadistrictaaron";

  return (
    <section className={classes.scheduleSection}>
      <p>Mondays</p>
      <li className={classes.yogaClass}>
        6:30am - Power Flow - Bouldering Project DC
        <a className={classes.signUpLink} href={dcBoulderingProject}>
          <em>Sign Up</em>
        </a>
      </li>
      <li className={classes.yogaClass}>
        6:30pm - All Levels Flow - Yoga District{" "}
        <a className={classes.signUpLink} href={yogaDistrictLink}>
          <em>Sign Up</em>
        </a>
      </li>
    </section>
  );
};

export default Schedule;
