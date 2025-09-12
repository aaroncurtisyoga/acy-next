import Link from "next/link";
import { FaYoutube, FaSpotify, FaInstagram } from "react-icons/fa";
import ThemeToggle from "@/app/_components/ThemeToggle";

const Footer = () => {
  return (
    <footer
      data-testid="footer"
      className="border-t border-slate-200 dark:border-slate-700 py-4 bg-white dark:bg-[#0a0a0a] text-slate-700 dark:text-slate-300 flex-shrink-0"
    >
      <div className="wrapper-width">
        <div className="flex items-center justify-between">
          {/* Theme toggle - left side */}
          <div>
            <ThemeToggle />
          </div>

          {/* Social links - right side */}
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
