import Link from "next/link";
import { Link as NextUiLink } from "@nextui-org/react";
import { AudioLines, Instagram, Youtube } from "lucide-react";
import NewsletterForm from "@/_components/NewsletterForm";
import { instructorEmailAddress } from "@/_lib/constants";

const Footer = () => {
  return (
    <footer data-testid="footer" className={"border-t py-6 bg-zinc-50"}>
      <div
        className={
          "wrapper-width flex flex-col justify-center md:flex-row" +
          " md:justify-between md:items-start *:flex-1 gap-8 md:gap-0"
        }
      >
        {/* Newsletter Signup Form */}
        <div data-testid="footer-newsletter" className={"flex justify-center"}>
          <NewsletterForm />
        </div>

        {/* Social Media Links */}
        <div
          data-testid="footer-social-links"
          className={"flex justify-center"}
        >
          <Link
            href={"https://www.youtube.com/channel/UCwwNWri2IhKxXKmQkCpj-uw"}
            target={"_blank"}
            data-testid="footer-youtube-link"
          >
            <Youtube />
          </Link>
          <Link
            className={"mx-5"}
            href={
              "https://open.spotify.com/user/31fmmphtelatfs7ra4tvboorm4qy?si=c32d094ea2c84e08"
            }
            target={"_blank"}
            data-testid="footer-spotify-link"
          >
            <AudioLines />
          </Link>
          <Link
            href={"https://www.instagram.com/aaroncurtisyoga/"}
            target={"_blank"}
            data-testid="footer-instagram-link"
          >
            <Instagram />
          </Link>
        </div>

        {/* Contact and Credits */}
        <div
          data-testid="footer-contact"
          className={"text-center md:text-end *:mb-4 *:md:mb-2 *:text-tiny"}
        >
          <p data-testid="footer-copyright">
            © {new Date().getFullYear()} All Rights Reserved
          </p>
          <p>
            Reach out by{" "}
            <NextUiLink
              data-testid="footer-email-link"
              isExternal
              size="sm"
              underline={"hover"}
              className={"text-tiny"}
              href={`mailto:${instructorEmailAddress}`}
            >
              {" "}
              Email
            </NextUiLink>
          </p>
          <p>
            Made by{" "}
            <NextUiLink
              data-testid="footer-github-link"
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
