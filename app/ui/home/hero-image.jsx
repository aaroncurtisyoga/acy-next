import Image from "next/image";
import React from "react";
const HeroImage = () => {
  return (
    <section id="heroImage">
      <Image
        alt="Yoga posture hand to big toe"
        className="object-cover"
        fill={true}
        priority={true}
        loading="eager"
        src="/images/042321_YogaPose_HandToBigToe.jpg"
      />
    </section>
  );
};

export default HeroImage;
