import { FC } from "react";
import { merriweather } from "@/app/fonts";

const Logo: FC = () => {
  return (
    <span
      className={`sm:flex font-extrabold text-xl ${merriweather.className}`}
    >
      Aaron Curtis Yoga
    </span>
  );
};

export default Logo;
