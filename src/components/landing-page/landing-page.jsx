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
        <h1 className={classes.headline}>Flow.</h1>
        <p className={classes.subHeadlineCopy}>
          ✌🏾 What&apos;s up y&apos;all, I&apos;d love to practice with you! I
          teach just about every day of the week. And, in multiple places
          throughout Washington, D.C. So drop in and say hey 🙂 My classes are
          inspired from various styles, typically include time for meditation
          and breath work, and every once in a while, a sound bath for savasana.
          I hope to see you on the mat soon!
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
