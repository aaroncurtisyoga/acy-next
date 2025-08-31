import Link from "next/link";
import { AudioLines, Instagram, Youtube } from "lucide-react";
import NewsletterForm from "@/app/_components/NewsletterForm";
import ThemeToggle from "@/app/_components/ThemeToggle";

const Footer = () => {
  return (
    <footer
      data-testid="footer"
      className="border-t border-slate-200 dark:border-slate-700 py-12 bg-gradient-to-br from-stone-50 via-blue-50/20 to-slate-50 dark:bg-[#0a0a0a] text-slate-700 dark:text-slate-300 relative overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
                         radial-gradient(circle at 80% 20%, rgba(156, 163, 175, 0.04) 0%, transparent 50%)`,
      }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23374151' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="wrapper-width">
          {/* Single responsive layout */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 md:gap-12">
            {/* Newsletter */}
            <div
              data-testid="footer-newsletter"
              className="flex-shrink-0 order-2 md:order-1"
            >
              <NewsletterForm />
            </div>

            {/* Social & Copyright */}
            <div className="flex flex-col items-center md:items-end gap-6 order-1 md:order-2">
              <div
                data-testid="footer-social-links"
                className="flex items-center"
              >
                <div className="flex items-center gap-6">
                  <Link
                    href="https://www.youtube.com/channel/UCwwNWri2IhKxXKmQkCpj-uw"
                    target="_blank"
                    data-testid="footer-youtube-link"
                    aria-label="Visit Aaron on YouTube"
                    className="group"
                  >
                    <div className="p-3 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-sm border border-gray-300 dark:border-slate-600 group-hover:bg-gray-100 dark:group-hover:bg-slate-700 transition-all duration-300">
                      <Youtube className="w-6 h-6 text-slate-600 dark:text-slate-300 transition-colors duration-300" />
                    </div>
                  </Link>
                  <Link
                    href="https://open.spotify.com/user/31fmmphtelatfs7ra4tvboorm4qy?si=c32d094ea2c84e08"
                    target="_blank"
                    data-testid="footer-spotify-link"
                    aria-label="See Aaron's playlists on Spotify"
                    className="group"
                  >
                    <div className="p-3 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-sm border border-gray-300 dark:border-slate-600 group-hover:bg-gray-100 dark:group-hover:bg-slate-700 transition-all duration-300">
                      <AudioLines className="w-6 h-6 text-slate-600 dark:text-slate-300 transition-colors duration-300" />
                    </div>
                  </Link>
                  <Link
                    href="https://www.instagram.com/aaroncurtisyoga/"
                    target="_blank"
                    data-testid="footer-instagram-link"
                    aria-label="Follow Aaron on Instagram"
                    className="group"
                  >
                    <div className="p-3 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-sm border border-gray-300 dark:border-slate-600 group-hover:bg-gray-100 dark:group-hover:bg-slate-700 transition-all duration-300">
                      <Instagram className="w-6 h-6 text-slate-600 dark:text-slate-300 transition-colors duration-300" />
                    </div>
                  </Link>
                </div>
              </div>

              {/* Copyright & theme toggle */}
              <div className="text-center md:text-right">
                <div className="flex items-center justify-center md:justify-end gap-4">
                  <p
                    data-testid="footer-copyright"
                    className="text-slate-500 dark:text-slate-400 text-sm"
                  >
                    © {new Date().getFullYear()} Aaron Curtis Yoga
                  </p>
                  <ThemeToggle />
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
