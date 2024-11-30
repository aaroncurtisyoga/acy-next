"use client";

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
} from "@nextui-org/react";
import { merriweather } from "@/app/fonts";

const DesktopNavigation = dynamic(
  () => import("@/_components/DesktopNavigation"),
  {
    ssr: false,
  },
);
const MobileNavigation = dynamic(
  () => import("@/_components/MobileNavigation"),
  {
    ssr: false,
  },
);

const Header = () => {
  return (
    <Navbar data-testid="navbar" isBordered maxWidth="xl">
      <NavbarContent>
        <NavbarBrand data-testid="navbar-brand">
          <Link href="/">
            <h1
              className={`sm:flex font-extrabold text-xl ${merriweather.className}`}
            >
              Aaron Curtis Yoga
            </h1>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Navigation */}
      <NavbarContent className="hidden sm:flex" justify="end">
        <DesktopNavigation />
      </NavbarContent>

      {/* Mobile Navigation */}
      <NavbarContent className="sm:hidden" justify="end">
        <NavbarMenuToggle aria-label="Open menu" />
      </NavbarContent>
      <NavbarMenu>
        <MobileNavigation />
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;
