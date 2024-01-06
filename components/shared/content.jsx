import React from "react";
import Schedule from "../schedule/schedule";
import classes from "./landingPage.module.scss";

const Content = () => {
  return (
    <section id="content" className={classes.contentCopy}>
      <Schedule />
    </section>
  );
};

export default Content;
