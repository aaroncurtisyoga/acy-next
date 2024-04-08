import Link from "next/link";
import { Link as NextUiLink } from "@nextui-org/react";

import { AudioLines, Instagram, Youtube } from "lucide-react";
import NewsletterForm from "@/components/newsletter/NewsletterForm";

const Footer = () => {
  return (
    <footer className={"border-t py-unit-6 bg-zinc-50"}>
      <div
        className={
          "wrapper-width flex flex-col justify-center md:flex-row" +
          " md:justify-between md:items-start *:flex-1 gap-unit-8 md:gap-0"
        }
      >
        <div className={"flex justify-center"}>
          <NewsletterForm />
        </div>
        <div className={"flex justify-center"}>
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
        <div
          className={
            "text-center md:text-end *:mb-unit-4 *:md:mb-unit-2" +
            " *:text-tiny"
          }
        >
          <p>© {new Date().getFullYear()} All Rights Reserved</p>
          <p>
            Reach out by{" "}
            <NextUiLink
              isExternal
              size="sm"
              underline={"hover"}
              className={"text-tiny"}
              href="mailto:aaroncurtisyoga@gmail.com"
            >
              {" "}
              Email
            </NextUiLink>
          </p>
          <p>
            Made by{" "}
            <NextUiLink
              className={"text-tiny"}
              href="https://github.com/aaroncurtisyoga/acy-next"
              isExternal
              size="sm"
              target="_blank"
              underline={"hover"}
            >
              Aaron
            </NextUiLink>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
