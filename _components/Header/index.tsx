"use client";

import { FC, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Navbar } from "@nextui-org/react";
import DesktopNavbarContent from "@/_components/Header/DesktopNavbarContent";
import Logo from "@/_components/Header/Logo";
import MobileNavbarContent from "@/_components/Header/MobileNavbarContent";
import {
  adminLinks,
  authenticatedLinks,
  unauthenticatedLinks,
} from "@/_lib/constants";

const Header: FC = () => {
  const { isSignedIn, isLoaded, user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([...unauthenticatedLinks]);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      const isAdmin = user?.publicMetadata.role === "admin";
      setMenuItems(() => [
        ...unauthenticatedLinks,
        ...authenticatedLinks,
        ...(isAdmin ? adminLinks : []),
      ]);
    } else {
      setMenuItems([...unauthenticatedLinks]);
    }
  }, [isLoaded, user, isSignedIn]);

  return (
    <Navbar
      data-testid="navbar"
      onMenuOpenChange={setIsMenuOpen}
      isBordered
      maxWidth="xl"
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
      <Logo />
      <MobileNavbarContent isMenuOpen={isMenuOpen} menuItems={menuItems} />
      <DesktopNavbarContent isLoaded={isLoaded} menuItems={menuItems} />
    </Navbar>
  );
};

export default Header;
