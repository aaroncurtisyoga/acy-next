import { FC } from "react";

interface OfferingProps {
  time: string;
  name: string;
  location: string;
  link: string;
}

const Offering: FC<OfferingProps> = ({ time, name, location, link }) => {
  return (
    <p id={"offering"}>
      {time} - {name} - {location} -
      <a className={"sign-up"} href={link} rel="noreferrer" target="_blank">
        Sign Up
      </a>
    </p>
  );
};

export default Offering;
