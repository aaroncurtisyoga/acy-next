import { FC } from "react";

interface HeadlineProps {
  title: string;
}
const Headline: FC<HeadlineProps> = ({ title }) => {
  return (
    <h1 className={"text-[2rem] md:text-[3.25rem] font-extrabold mb-5 md:mb-8"}>
      {title}
    </h1>
  );
};

export default Headline;
