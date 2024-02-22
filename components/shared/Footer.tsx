import Link from "next/link";
import React from "react";
import { AudioLines, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className={"w-full border-t"}>
      <div className="wrapper flex md:justify-between">
        <div className={"text-sm hidden md:block"}>
          © {new Date().getFullYear()} Aaron Curtis Yoga
        </div>
        <div className={"flex justify-between"}>
          <Link
            href={"https://www.youtube.com/channel/UCwwNWri2IhKxXKmQkCpj-uw"}
            target={"_blank"}
          >
            <Youtube />
          </Link>
          <Link
            className={"mx-5"}
            href={
              "https://open.spotify.com/user/31fmmphtelatfs7ra4tvboorm4qy?si=c32d094ea2c84e08"
            }
            target={"_blank"}
          >
            <AudioLines />
          </Link>
          <Link
            href={"https://www.instagram.com/aaroncurtisyoga/"}
            target={"_blank"}
          >
            <Instagram />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
