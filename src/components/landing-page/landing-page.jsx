import Image from "next/image";
import React from "react";
import Schedule from "../schedule/schedule";
import IconLinks from "./icon-links";
import classes from "./landingPage.module.scss";

const LandingPage = () => {
  return (
    <section className={classes.landingPageSection}>
      <div className={classes.contentImage}>
        <div className={classes.contentImageWrapper}>
          <Image
            src="/images/042321_YogaPose_HandToBigToe.jpg"
            alt="Aaron Curtis Yoga Pose"
            layout={"fill"}
            objectFit={"cover"}
            objectPosition={"50% 50%"}
            data-testid={`landing-page-image`}
          />
        </div>
      </div>
      <div className={classes.contentCopy}>
        <div className={classes.name}>Aaron Curtis</div>
        <h1 className={classes.headline}>Be/Do Good.</h1>
        <p className={classes.subHeadlineCopy}>
          ✌🏾 I study & practice yoga. Focusing on things like pranayama,
          meditation, and functional/fun movement. If you want to practice
          together, drop in to a class, workshop, or send me a note so we can
          set up a private session.
        </p>
        <br />
        <Schedule />
        <br />
        <IconLinks />
      </div>
    </section>
  );
};

export default LandingPage;
