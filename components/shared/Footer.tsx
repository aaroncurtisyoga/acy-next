import Link from "next/link";
import { AudioLines, Instagram, Youtube } from "lucide-react";
import NewsletterForm from "@/components/newsletter/NewsletterForm";

const Footer = () => {
  return (
    <footer className={"border-t py-unit-6"}>
      <div className={"flex justify-between wrapper-width"}>
        <div>
          <NewsletterForm />
        </div>
        <div className={"flex"}>
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
        <div>
          <p className="text-tiny">
            © {new Date().getFullYear()} All Rights Reserved
          </p>
          <p className="text-tiny">Made by Aaron</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
