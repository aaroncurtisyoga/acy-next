import Link from "next/link";
import { Link as HeroUiLink } from "@heroui/react";
import { AudioLines, Instagram, Youtube } from "lucide-react";
import NewsletterForm from "@/app/_components/NewsletterForm";
import { instructorEmailAddress } from "@/app/_lib/constants";

const Footer = () => {
  return (
    <footer
      data-testid="footer"
      className="border-t border-slate-200 py-12 bg-gradient-to-br from-stone-50 via-blue-50/20 to-slate-50 text-slate-700 relative overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
                         radial-gradient(circle at 80% 20%, rgba(156, 163, 175, 0.04) 0%, transparent 50%)`,
      }}
    >
      {/* Subtle yoga-inspired pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23374151' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div
          className={
            "wrapper-width flex flex-col justify-center md:flex-row" +
            " md:justify-between md:items-start gap-12 md:gap-8"
          }
        >
          {/* Newsletter Signup Form */}
          <div
            data-testid="footer-newsletter"
            className="flex-1 flex justify-center md:justify-start"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
              <NewsletterForm />
            </div>
          </div>

          {/* Social Media Links */}
          <div
            data-testid="footer-social-links"
            className="flex-1 flex justify-center items-center"
          >
            <div className="flex items-center gap-6">
              <Link
                href={
                  "https://www.youtube.com/channel/UCwwNWri2IhKxXKmQkCpj-uw"
                }
                target={"_blank"}
                data-testid="footer-youtube-link"
                aria-label={"Visit Aaron on YouTube"}
                className="group"
              >
                <div className="p-3 rounded-full bg-white/70 backdrop-blur-sm shadow-sm border border-white/30 group-hover:bg-red-50 group-hover:border-red-200 group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
                  <Youtube className="w-6 h-6 text-slate-600 group-hover:text-red-600 transition-colors duration-300" />
                </div>
              </Link>
              <Link
                href={
                  "https://open.spotify.com/user/31fmmphtelatfs7ra4tvboorm4qy?si=c32d094ea2c84e08"
                }
                target={"_blank"}
                data-testid="footer-spotify-link"
                aria-label={"See Aaron's playlists on Spotify"}
                className="group"
              >
                <div className="p-3 rounded-full bg-white/70 backdrop-blur-sm shadow-sm border border-white/30 group-hover:bg-green-50 group-hover:border-green-200 group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
                  <AudioLines className="w-6 h-6 text-slate-600 group-hover:text-green-600 transition-colors duration-300" />
                </div>
              </Link>
              <Link
                href="https://www.instagram.com/aaroncurtisyoga/"
                target="_blank"
                data-testid="footer-instagram-link"
                aria-label={"Follow Aaron on Instagram"}
                className="group"
              >
                <div className="p-3 rounded-full bg-white/70 backdrop-blur-sm shadow-sm border border-white/30 group-hover:bg-pink-50 group-hover:border-pink-200 group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
                  <Instagram className="w-6 h-6 text-slate-600 group-hover:text-pink-600 transition-colors duration-300" />
                </div>
              </Link>
            </div>
          </div>

          {/* Contact and Credits */}
          <div
            data-testid="footer-contact"
            className="flex-1 text-center md:text-end space-y-4 text-sm"
          >
            <p
              data-testid="footer-copyright"
              className="text-slate-600 font-medium"
            >
              © {new Date().getFullYear()} All Rights Reserved
            </p>
            <p className="text-slate-600">
              Reach out by{" "}
              <HeroUiLink
                data-testid="footer-email-link"
                isExternal
                size="sm"
                underline="hover"
                className="text-blue-700 hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 font-medium"
                href={`mailto:${instructorEmailAddress}`}
              >
                Email
              </HeroUiLink>
            </p>
            <p className="text-slate-600">
              Made with{" "}
              <HeroUiLink
                data-testid="footer-github-link"
                className="text-blue-700 hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 font-medium"
                href="https://github.com/aaroncurtisyoga/acy-next"
                isExternal
                size="sm"
                target="_blank"
                underline="hover"
              >
                ♡{" "}
              </HeroUiLink>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
