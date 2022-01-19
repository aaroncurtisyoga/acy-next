import Image from "next/image";
import classes from "./profile.module.scss";

export default function Profile() {
  return (
    <>
      {/*todo:  Style link*/}
      <div className={classes.imgWrapper}>
        <Image
          src="/images/profile.JPG"
          height={96}
          width={96}
          alt="Aaron Curtis"
          layout={"intrinsic"}
          objectFit="cover"
        />
      </div>

      <p>
        <a
          href="https://www.instagram.com/aaroncurtisyoga"
          target={`_blank`}
          className={`color-white`}
        >
          @aaroncurtisyoga
        </a>
      </p>
    </>
  );
}
