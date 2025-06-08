"use client";

import { FC, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Navbar } from "@heroui/react";
import DesktopNavbarContent from "@/app/_components/Header/DesktopNavbarContent";
import Logo from "@/app/_components/Header/Logo";
import MobileNavbarContent from "@/app/_components/Header/MobileNavbarContent";
import UserDropdown from "@/app/_components/Header/UserDropdown";
import { adminLinks, authenticatedLinks } from "@/app/_lib/constants";

const Header: FC = () => {
  const { isSignedIn, isLoaded, user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [linksForLoggedInUsers, setLinksForLoggedInUsers] = useState<
    Array<{
      name: string;
      href: string;
      testId: string;
    }>
  >([]);

  useEffect(() => {
    // Only update menu items after Clerk has loaded
    if (!isLoaded) return;

    // Update authenticated menu items based on user's role
    if (isSignedIn) {
      const isAdmin = user?.publicMetadata?.role === "admin";
      setLinksForLoggedInUsers([
        ...authenticatedLinks,
        ...(isAdmin ? adminLinks : []),
      ]);
    } else {
      // Reset authenticated menu items if user is not signed in
      setLinksForLoggedInUsers([]);
    }
  }, [isLoaded, user, isSignedIn]);

  return (
    <Navbar
      data-testid="navbar"
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      isBordered
      maxWidth="2xl"
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          // Remove bold from active state
          "data-[active=true]:font-normal",
          // Active state styling
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[3px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
          // Hover state styling
          "hover:after:content-['']",
          "hover:after:absolute",
          "hover:after:bottom-0",
          "hover:after:left-0",
          "hover:after:right-0",
          "hover:after:h-[3px]",
          "hover:after:rounded-[2px]",
          "hover:after:bg-primary",
          // Transition
          "after:transition-all",
          "after:duration-200",
        ],
      }}
    >
      <Logo setIsMenuOpen={setIsMenuOpen} />

      {/* Mobile navigation - UserDropdown will be part of the mobile menu content */}
      <MobileNavbarContent
        linksForLoggedInUsers={linksForLoggedInUsers}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isSignedIn={isSignedIn}
      />

      {/* Desktop navigation with separate UserDropdown */}
      <DesktopNavbarContent>
        <UserDropdown
          linksForLoggedInUsers={linksForLoggedInUsers}
          isSignedIn={isSignedIn}
          className="hidden sm:block" // Hide on mobile, show on desktop
        />
      </DesktopNavbarContent>
    </Navbar>
  );
};

export default Header;
