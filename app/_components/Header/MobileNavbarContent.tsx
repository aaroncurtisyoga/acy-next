"use client";

import { FC } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import {
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import { Menu } from "lucide-react";
import ThemeToggle from "@/app/_components/ThemeToggle";
import { unauthenticatedLinks } from "@/app/_lib/constants";

interface MobileNavbarContentProps {
  linksForLoggedInUsers: { href: string; name: string; testId: string }[];
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  isSignedIn?: boolean;
}

const MobileNavbarContent: FC<MobileNavbarContentProps> = ({
  linksForLoggedInUsers,
  isMenuOpen,
  setIsMenuOpen,
  isSignedIn = false,
}) => {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const router = useRouter();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSignOut = () => {
    signOut(() => router.push("/"));
    closeMenu();
  };

  // Conditional styling for menu toggle based on sign-in state
  const toggleClasses = isSignedIn
    ? "transition-all duration-200 ease-out bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-full"
    : "transition-all duration-200 ease-out hover:bg-gray-100/50 dark:hover:bg-gray-800/50";

  return (
    <>
      <NavbarContent className="sm:hidden" justify="end">
        {/* Theme Toggle for Mobile */}
        <ThemeToggle />

        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          icon={
            <Menu
              className={
                isSignedIn
                  ? "text-primary-700 dark:text-white"
                  : "text-gray-700 dark:text-gray-300"
              }
            />
          }
          data-testid="menu-toggle"
          className={toggleClasses}
        />
      </NavbarContent>

      <NavbarMenu data-testid="navbar-menu-mobile">
        {/* Unauthenticated Links - visible to all users */}
        {unauthenticatedLinks.map((link, index) => (
          <NavbarMenuItem
            key={`${link.name}-${index}`}
            isActive={pathname.includes(link.href)}
          >
            <Link
              data-testid={`navbar-menu-item-${link.testId}`}
              className="w-full"
              href={link.href}
              onClick={closeMenu}
            >
              {link.name}
            </Link>
          </NavbarMenuItem>
        ))}

        {/* Authenticated Links - only visible when signed in */}
        {isSignedIn &&
          linksForLoggedInUsers.map((link, index) => (
            <NavbarMenuItem
              key={`${link.name}-${index}`}
              isActive={pathname.includes(link.href)}
            >
              <Link
                data-testid={`navbar-menu-item-${link.testId}`}
                className="w-full"
                href={link.href}
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            </NavbarMenuItem>
          ))}

        {/* Auth Links - show sign in or sign out */}
        <NavbarMenuItem>
          {isSignedIn ? (
            <button
              data-testid="navbar-menu-item-logout"
              className="w-full text-left"
              onClick={handleSignOut}
            >
              Log out
            </button>
          ) : (
            <Link
              data-testid="navbar-menu-item-login"
              className="w-full"
              href="/sign-in"
              onClick={closeMenu}
            >
              Log in
            </Link>
          )}
        </NavbarMenuItem>
      </NavbarMenu>
    </>
  );
};

export default MobileNavbarContent;
