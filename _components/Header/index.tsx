"use client";

import { FC, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Navbar } from "@nextui-org/react";
import DesktopNavbarContent from "@/_components/Header/DesktopNavbarContent";
import Logo from "@/_components/Header/Logo";
import MobileNavbarContent from "@/_components/Header/MobileNavbarContent";
import UserDropdown from "@/_components/Header/UserDropdown";
import { adminLinks, authenticatedLinks } from "@/_lib/constants";

const Header: FC = () => {
  const { isSignedIn, isLoaded, user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [linksForLoggedInUsers, setLinksForLoggedInUsers] = useState([]);

  useEffect(() => {
    // Only update menu items after Clerk has loaded
    if (!isLoaded) return;

    // Update authenticated menu items based on user's role
    if (isSignedIn) {
      const isAdmin = user?.publicMetadata.role === "admin";
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
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
    >
      <Logo setIsMenuOpen={setIsMenuOpen} />
      <MobileNavbarContent
        authenticatedLinks={linksForLoggedInUsers}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <DesktopNavbarContent>
        <UserDropdown
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          linksForLoggedInUsers={linksForLoggedInUsers}
        />
      </DesktopNavbarContent>
    </Navbar>
  );
};

export default Header;
