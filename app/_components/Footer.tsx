import Link from "next/link";
import { AudioLines, Instagram, Youtube } from "lucide-react";
import NewsletterForm from "@/app/_components/NewsletterForm";

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
        <div className="wrapper-width">
          {/* Mobile: Centered stacked layout */}
          <div className="flex flex-col items-center gap-12 md:hidden">
            {/* Newsletter Signup Form */}
            <div
              data-testid="footer-newsletter"
              className="flex justify-center"
            >
              <NewsletterForm />
            </div>

            {/* Social Media Links with Copyright */}
            <div className="flex flex-col items-center gap-6">
              <div
                data-testid="footer-social-links"
                className="flex justify-center items-center"
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
                    <div className="p-3 rounded-full bg-white/70 backdrop-blur-sm shadow-sm border border-white/30 group-hover:bg-gray-100 group-hover:border-gray-300 transition-all duration-300">
                      <Youtube className="w-6 h-6 text-slate-600 transition-colors duration-300" />
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
                    <div className="p-3 rounded-full bg-white/70 backdrop-blur-sm shadow-sm border border-white/30 group-hover:bg-gray-100 group-hover:border-gray-300 transition-all duration-300">
                      <AudioLines className="w-6 h-6 text-slate-600 transition-colors duration-300" />
                    </div>
                  </Link>
                  <Link
                    href="https://www.instagram.com/aaroncurtisyoga/"
                    target="_blank"
                    data-testid="footer-instagram-link"
                    aria-label={"Follow Aaron on Instagram"}
                    className="group"
                  >
                    <div className="p-3 rounded-full bg-white/70 backdrop-blur-sm shadow-sm border border-white/30 group-hover:bg-gray-100 group-hover:border-gray-300 transition-all duration-300">
                      <Instagram className="w-6 h-6 text-slate-600 transition-colors duration-300" />
                    </div>
                  </Link>
                </div>
              </div>

              {/* Copyright under social icons */}
              <div className="text-center">
                <p
                  data-testid="footer-copyright"
                  className="text-slate-500 text-sm"
                >
                  © {new Date().getFullYear()} Aaron Curtis
                </p>
              </div>
            </div>
          </div>

          {/* Desktop: Newsletter left, Social right */}
          <div className="hidden md:block">
            <div className="flex justify-between items-start">
              {/* Newsletter Signup Form */}
              <div data-testid="footer-newsletter" className="flex-shrink-0">
                <NewsletterForm />
              </div>

              {/* Social Media Links with Copyright */}
              <div className="flex flex-col items-end gap-6">
                <div
                  data-testid="footer-social-links"
                  className="flex justify-end items-center"
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
                      <div className="p-3 rounded-full bg-white/70 backdrop-blur-sm shadow-sm border border-white/30 group-hover:bg-gray-100 group-hover:border-gray-300 transition-all duration-300">
                        <Youtube className="w-6 h-6 text-slate-600 transition-colors duration-300" />
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
                      <div className="p-3 rounded-full bg-white/70 backdrop-blur-sm shadow-sm border border-white/30 group-hover:bg-gray-100 group-hover:border-gray-300 transition-all duration-300">
                        <AudioLines className="w-6 h-6 text-slate-600 transition-colors duration-300" />
                      </div>
                    </Link>
                    <Link
                      href="https://www.instagram.com/aaroncurtisyoga/"
                      target="_blank"
                      data-testid="footer-instagram-link"
                      aria-label={"Follow Aaron on Instagram"}
                      className="group"
                    >
                      <div className="p-3 rounded-full bg-white/70 backdrop-blur-sm shadow-sm border border-white/30 group-hover:bg-gray-100 group-hover:border-gray-300 transition-all duration-300">
                        <Instagram className="w-6 h-6 text-slate-600 transition-colors duration-300" />
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Copyright under social icons */}
                <div className="text-right">
                  <p
                    data-testid="footer-copyright"
                    className="text-slate-500 text-sm"
                  >
                    © {new Date().getFullYear()} Aaron Curtis
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
