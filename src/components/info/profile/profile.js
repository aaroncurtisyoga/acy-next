import Image from "next/image";
import classes from "./profile.module.scss";

export default function Profile() {
  return (
    <>
      {/*todo:  Style link*/}
      <div className={classes.imgWrapper}>
        <Image
          src="/images/profile.jpg"
          height={96}
          width={96}
          alt="Aaron Curtis"
          borderRadius={"50%"}
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
