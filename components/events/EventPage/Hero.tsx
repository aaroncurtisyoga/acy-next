import Image from "next/image";
import React from "react";

const Hero = ({ imageUrl }) => {
  return (
    <div className="event-hero-wrapper w-full relative">
      <div className={"event-hero h-[50vw] md:h-[500px]"}>
        <Image
          alt="Event Hero Image"
          className="object-cover object-center overflow-hidden relative"
          fill={true}
          priority={true}
          sizes="(min-width: 1280px) 1200px, calc(93.75vw + 19px)"
          src={imageUrl}
        />
      </div>
    </div>
  );
};

export default Hero;
