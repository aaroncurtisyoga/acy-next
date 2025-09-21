import Link from "next/link";
import { FaYoutube, FaSpotify, FaInstagram } from "react-icons/fa";
import ThemeToggle from "@/app/_components/ThemeToggle";
import { track } from "@vercel/analytics";

const Footer = () => {
  return (
    <footer
      data-testid="footer"
      className="border-t border-slate-200 dark:border-slate-700 py-4 bg-white dark:bg-[#0a0a0a] text-slate-700 dark:text-slate-300 flex-shrink-0"
    >
      <div className="w-full max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col-reverse sm:flex-row items-center sm:justify-between gap-7 sm:gap-0">
          {/* Theme toggle - left side on desktop, bottom on mobile */}
          <div className="sm:block">
            <ThemeToggle />
          </div>

          {/* Social links - right side on desktop, top on mobile */}
          <div
            data-testid="footer-social-links"
            className="flex items-center gap-6"
          >
            <Link
              href="https://www.youtube.com/channel/UCwwNWri2IhKxXKmQkCpj-uw"
              target="_blank"
              data-testid="footer-youtube-link"
              aria-label="Visit Aaron on YouTube"
              className="group"
              onClick={() => {
                track("social_media", {
                  action: "youtube_click",
                  source: "footer",
                });
              }}
            >
              <div className="p-3 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-sm border border-gray-300 dark:border-slate-600">
                <FaYoutube className="w-6 h-6 text-[#FF0000]" />
              </div>
            </Link>
            <Link
              href="https://open.spotify.com/user/31fmmphtelatfs7ra4tvboorm4qy?si=c32d094ea2c84e08"
              target="_blank"
              data-testid="footer-spotify-link"
              aria-label="See Aaron's playlists on Spotify"
              className="group"
              onClick={() => {
                track("social_media", {
                  action: "spotify_click",
                  source: "footer",
                });
              }}
            >
              <div className="p-3 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-sm border border-gray-300 dark:border-slate-600">
                <FaSpotify className="w-6 h-6 text-[#1DB954]" />
              </div>
            </Link>
            <Link
              href="https://www.instagram.com/aaroncurtisyoga/"
              target="_blank"
              data-testid="footer-instagram-link"
              aria-label="Follow Aaron on Instagram"
              className="group"
              onClick={() => {
                track("social_media", {
                  action: "instagram_click",
                  source: "footer",
                });
              }}
            >
              <div className="p-3 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-sm border border-gray-300 dark:border-slate-600">
                <FaInstagram className="w-6 h-6 text-[#E4405F]" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
