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
      className="bg-white shadow-sm static"
      classNames={{
        base: "static",
        wrapper: "px-6 py-4",
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "px-3",
          "py-2",
          "rounded-lg",
          "data-[active=true]:text-slate-800",
          "data-[active=true]:bg-slate-100",
          "data-[active=true]:font-normal",
          "hover:text-slate-700",
          "hover:bg-slate-50",
          "transition-all",
          "duration-200",
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
