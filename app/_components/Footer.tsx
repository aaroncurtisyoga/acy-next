import Link from "next/link";
import { Link as NextUiLink } from "@nextui-org/react";
import { AudioLines, Instagram, Youtube } from "lucide-react";
import NewsletterForm from "@/app/_components/NewsletterForm";
import { instructorEmailAddress } from "@/app/_lib/constants";

const Footer = () => {
  return (
    <footer
      data-testid="footer"
      className="border-t py-6 bg-zinc-50 text-gray-800"
    >
      <div
        className={
          "wrapper-width flex flex-col justify-center md:flex-row" +
          " md:justify-between md:items-start gap-8 md:gap-0"
        }
      >
        {/* Newsletter Signup Form */}
        <div
          data-testid="footer-newsletter"
          className="flex-1 flex justify-center md:justify-start"
        >
          <NewsletterForm />
        </div>

        {/* Social Media Links */}
        <div
          data-testid="footer-social-links"
          className="flex-1 flex justify-center"
        >
          <Link
            href={"https://www.youtube.com/channel/UCwwNWri2IhKxXKmQkCpj-uw"}
            target={"_blank"}
            data-testid="footer-youtube-link"
            aria-label={"Visit Aaron on YouTube"}
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
            aria-label={"See Aaron's playlists on Spotify"}
          >
            <AudioLines />
          </Link>
          <Link
            href="https://www.instagram.com/aaroncurtisyoga/"
            target="_blank"
            data-testid="footer-instagram-link"
            aria-label={"Follow Aaron on Instagram"}
          >
            <Instagram />
          </Link>
        </div>

        {/* Contact and Credits */}
        <div
          data-testid="footer-contact"
          className="flex-1 text-center md:text-end *:mb-4 *:md:mb-2 text-sm"
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
              underline="hover"
              className="text-blue-700 hover:text-blue-500 focus-visible:ring focus-visible:ring-blue-300"
              href={`mailto:${instructorEmailAddress}`}
            >
              Email
            </NextUiLink>
          </p>
          <p>
            Made by{" "}
            <NextUiLink
              data-testid="footer-github-link"
              className="text-blue-700 hover:text-blue-500 focus-visible:ring focus-visible:ring-blue-300"
              href="https://github.com/aaroncurtisyoga/acy-next"
              isExternal
              size="sm"
              target="_blank"
              underline="hover"
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
