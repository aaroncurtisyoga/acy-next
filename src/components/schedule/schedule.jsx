import React from "react";
import classes from "./schedule.module.scss";

const Schedule = () => {
  const dcBoulderingProject =
    "https://www.dcboulderingproject.com/yoga-fitness";
  const yogaDistrictLink = "https://www.bit.ly/yogadistrictaaron";
  const crossFitDcLink = "https://crossfitdc.com/";

  return (
    <section className={classes.scheduleSection}>
      <div>
        <p className={classes.day}>Monday</p>
        <p>
          6:30am - Power Flow - Bouldering Project DC{" "}
          <a href={dcBoulderingProject} rel="noreferrer" target="_blank">
            <em>Sign Up</em>
          </a>
        </p>
        <p>
          6:30pm - All Levels Flow - Yoga District{" "}
          <a href={yogaDistrictLink} rel="noreferrer" target="_blank">
            <em>Sign Up</em>
          </a>
        </p>
      </div>
      <br />

      <div>
        <p className={classes.day}>Tuesday</p>
        <p>
          6:45pm - Power Flow 1.5/3 - Yoga District{" "}
          <a href={yogaDistrictLink} rel="noreferrer" target="_blank">
            <em>Sign Up</em>
          </a>
        </p>
      </div>
      <br />

      <div className={classes.day}>
        <p className={classes.day}>Thursday</p>
        <p>
          12:00pm - Flow - Bouldering Project DC{" "}
          <a href={dcBoulderingProject} rel="noreferrer" target="_blank">
            <em>Sign Up</em>
          </a>
        </p>
      </div>
      <br />

      <div>
        <p className={classes.day}>Friday</p>
        <p>
          6:30am - Power Flow - Bouldering Project DC{" "}
          <a href={dcBoulderingProject} rel="noreferrer" target="_blank">
            <em>Sign Up</em>
          </a>
        </p>
      </div>
      <br />

      <div>
        <p className={classes.day}>Saturday</p>
        <p>
          10:30am - Flow 1.5/3 - Yoga District{" "}
          <a href={yogaDistrictLink} rel="noreferrer" target="_blank">
            <em>Sign Up</em>
          </a>
        </p>
      </div>
      <br />

      <div className={classes.day}>
        <p className={classes.day}>Sunday</p>
        <p>
          {" "}
          10:45am - Flow 2/3 - Yoga District{" "}
          <a href={yogaDistrictLink} rel="noreferrer" target="_blank">
            <em>Sign Up</em>
          </a>
        </p>
        <p>
          2:00pm - Mobility/Flexibility - CrossFit DC{" "}
          <a href={crossFitDcLink} rel="noreferrer" target="_blank">
            <em>Sign Up</em>
          </a>
        </p>
      </div>
    </section>
  );
};

export default Schedule;
