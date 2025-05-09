import { FC } from "react";
import Image from "next/image";
import { getBase64 } from "@/app/_lib/utils/base64";

interface HeroProps {
  imageUrl: string;
}
const Hero: FC<HeroProps> = async ({ imageUrl }) => {
  const blurDataURL = await getBase64(imageUrl);
  return (
    <div className="event-hero-wrapper w-full relative">
      <div className={"event-hero h-[50vw] md:h-[500px]"}>
        <Image
          alt="Event Hero Image"
          blurDataURL={blurDataURL}
          className="object-cover object-center overflow-hidden relative"
          fill={true}
          placeholder={"blur"}
          priority={true}
          sizes="(min-width: 1280px) 1200px, calc(93.75vw + 19px)"
          src={imageUrl}
        />
      </div>
    </div>
  );
};

export default Hero;
