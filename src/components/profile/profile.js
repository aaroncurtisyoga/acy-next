import Image from "next/image";
import classes from "./profile.module.scss";

export default function Profile() {
  return (
    <>
      <Image
        src="/temp-profile-pic.jpeg"
        height={96}
        width={96}
        alt="Aaron Curtis"
      />
      <p>
        <a href="https://www.instagram.com/aaroncurtisyoga">@aaroncurtisyoga</a>
      </p>
    </>
  );
}
