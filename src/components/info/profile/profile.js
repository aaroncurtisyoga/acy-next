import Image from "next/image";
import classes from "./profile.module.scss";

export default function Profile() {
  return (
    <>
      {/*todo: 1) Change profile img to match IG, 2) Style link*/}
      <Image
        src="/images/temp-profile-pic.jpeg"
        height={96}
        width={96}
        alt="Aaron Curtis"
      />
      <p>
        <a href="https://www.instagram.com/aaroncurtisyoga" target={`_blank`}>
          @aaroncurtisyoga
        </a>
      </p>
    </>
  );
}
