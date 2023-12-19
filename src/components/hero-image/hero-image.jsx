import Image from "next/image";
import React from "react";
import classes from "./heroImage.module.scss";
const HeroImage = () => {
  return (
    <section id="heroImage">
      <Image
        alt="Yoga posture hand to big toe"
        className={classes.heroImage}
        data-testid={`hero-image`}
        fill={true}
        loading="eager"
        src="/images/042321_YogaPose_HandToBigToe.jpg"
      />
    </section>
  );
};

export default HeroImage;
