"use client";

import { FC, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import {
  LogOut,
  LogIn,
  Shield,
  Home,
  Calendar,
  Users,
  Mail,
} from "lucide-react";
import { unauthenticatedLinks } from "@/app/_lib/constants";
import { useClerk } from "@clerk/nextjs";
import { type UserResource } from "@clerk/types";
import { track } from "@vercel/analytics";

interface MobileNavbarContentProps {
  linksForLoggedInUsers: { href: string; name: string; testId: string }[];
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  isSignedIn?: boolean;
  isLoaded?: boolean;
  user?: UserResource | null;
}

const MobileNavbarContent: FC<MobileNavbarContentProps> = ({
  linksForLoggedInUsers,
  isMenuOpen,
  setIsMenuOpen,
  isSignedIn = false,
  isLoaded = false,
  user,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, [setIsMenuOpen]);

  const handleSignOut = () => {
    track("auth", {
      action: "sign_out",
      source: "mobile_menu",
    });
    signOut(() => router.push("/"));
    closeMenu();
  };

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        closeMenu();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen, closeMenu]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Map icons to navigation links
  const getIconForLink = (href: string) => {
    if (href.includes("home") || href === "/")
      return <Home className="w-4 h-4" />;
    if (href.includes("events")) return <Calendar className="w-4 h-4" />;
    if (href.includes("community")) return <Users className="w-4 h-4" />;
    if (href.includes("contact")) return <Mail className="w-4 h-4" />;
    return null;
  };

  return (
    <>
      <NavbarContent className="sm:hidden" justify="end">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarMenu
        data-testid="navbar-menu-mobile"
        className="bg-white dark:bg-black shadow-xl px-6 py-4 overflow-y-auto"
      >
        {/* Auth Section at Top */}
        {isLoaded && isSignedIn && user ? (
          <>
            {/* User Info for signed-in users */}
            <NavbarMenuItem className="list-none mb-3">
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-inner">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-700 dark:from-gray-500 dark:to-gray-600 flex items-center justify-center text-white font-semibold shadow-lg text-lg">
                    {user.firstName && user.lastName
                      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                      : user.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ||
                        "U"}
                  </div>
                  {user.publicMetadata?.role === "admin" && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500 dark:bg-amber-400 rounded-full flex items-center justify-center shadow-md">
                      <Shield className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {user.fullName ||
                      user.emailAddresses?.[0]?.emailAddress?.split("@")[0]}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.emailAddresses?.[0]?.emailAddress}
                  </p>
                </div>
              </div>
            </NavbarMenuItem>

            {/* Sign Out Button */}
            <NavbarMenuItem className="list-none mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <button
                data-testid="navbar-menu-item-logout"
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </NavbarMenuItem>
          </>
        ) : (
          /* Sign In Button for non-authenticated users */
          <NavbarMenuItem className="list-none mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <Link
              data-testid="navbar-menu-item-login"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              href="/sign-in"
              onClick={() => {
                track("auth", {
                  action: "sign_in_click",
                  source: "mobile_menu",
                });
                closeMenu();
              }}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          </NavbarMenuItem>
        )}

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
                closeMenu();
              }}
            >
              {getIconForLink(link.href)}
              <span className="text-base">{link.name}</span>
            </Link>
          </NavbarMenuItem>
        ))}

        {/* Admin links */}
        {isSignedIn && linksForLoggedInUsers.length > 0 && (
          <>
            <NavbarMenuItem className="list-none mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 mb-2">
                Admin
              </p>
            </NavbarMenuItem>
            {linksForLoggedInUsers.map((link, index) => (
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
                    closeMenu();
                  }}
                >
                  <Shield className="w-4 h-4" />
                  <span className="text-base">{link.name}</span>
                </Link>
              </NavbarMenuItem>
            ))}
          </>
        )}
      </NavbarMenu>
    </>
  );
};

export default MobileNavbarContent;
