import { FC } from "react";
import { merriweather } from "@/app/fonts";

const Logo: FC = () => {
  return (
    <h1 className={`sm:flex font-extrabold text-xl ${merriweather.className}`}>
      Aaron Curtis Yoga
    </h1>
  );
};

export default Logo;
