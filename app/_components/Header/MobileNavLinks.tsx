"use client";

import { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavbarMenuItem } from "@heroui/navbar";
import { Home, Calendar, Users, Mail, Shield } from "lucide-react";
import { track } from "@vercel/analytics";
import { unauthenticatedLinks } from "@/app/_lib/constants";

interface NavLink {
  href: string;
  name: string;
  testId: string;
}

interface MobileNavLinksProps {
  adminLinks: NavLink[];
  isSignedIn: boolean;
  isMenuOpen: boolean;
  onClose: () => void;
}

const getIconForLink = (href: string) => {
  if (href.includes("home") || href === "/")
    return <Home className="w-4 h-4" />;
  if (href.includes("events")) return <Calendar className="w-4 h-4" />;
  if (href.includes("community")) return <Users className="w-4 h-4" />;
  if (href.includes("contact")) return <Mail className="w-4 h-4" />;
  return null;
};

const MobileNavLinks: FC<MobileNavLinksProps> = ({
  adminLinks,
  isSignedIn,
  isMenuOpen,
  onClose,
}) => {
  const pathname = usePathname();

  return (
    <>
      {/* Navigation links */}
      {unauthenticatedLinks.map((link, index) => (
        <NavbarMenuItem
          key={`${link.name}-${index}`}
          isActive={pathname.includes(link.href)}
          className="list-none"
          style={{
            animation: isMenuOpen
              ? `fadeInUp 0.2s ease-out ${index * 0.03 + 0.1}s both`
              : "",
          }}
        >
          <Link
            data-testid={`navbar-menu-item-${link.testId}`}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
              pathname.includes(link.href)
                ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
            }`}
            href={link.href}
            onClick={() => {
              track("navigation", {
                action: "mobile_nav_click",
                destination: link.name.toLowerCase(),
                href: link.href,
              });
              onClose();
            }}
          >
            {getIconForLink(link.href)}
            <span className="text-base">{link.name}</span>
          </Link>
        </NavbarMenuItem>
      ))}

      {/* Admin links */}
      {isSignedIn && adminLinks.length > 0 && (
        <>
          <NavbarMenuItem className="list-none mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 mb-2">
              Admin
            </p>
          </NavbarMenuItem>
          {adminLinks.map((link, index) => (
            <NavbarMenuItem
              key={`${link.name}-${index}`}
              isActive={pathname.includes(link.href)}
              className="list-none"
              style={{
                animation: isMenuOpen
                  ? `fadeInUp 0.2s ease-out ${(unauthenticatedLinks.length + index) * 0.03 + 0.1}s both`
                  : "",
              }}
            >
              <Link
                data-testid={`navbar-menu-item-${link.testId}`}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                  pathname.includes(link.href)
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
                }`}
                href={link.href}
                onClick={() => {
                  track("navigation", {
                    action: "mobile_admin_click",
                    destination: link.name.toLowerCase(),
                    href: link.href,
                  });
                  onClose();
                }}
              >
                <Shield className="w-4 h-4" />
                <span className="text-base">{link.name}</span>
              </Link>
            </NavbarMenuItem>
          ))}
        </>
      )}
    </>
  );
};

export default MobileNavLinks;
