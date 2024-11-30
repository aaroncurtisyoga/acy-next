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

const Navigation = dynamic(() => import("@/_components/Navigation"), {
  ssr: false,
});

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
      <NavbarContent justify="end">
        <NavbarMenuToggle aria-label="Open menu" />
      </NavbarContent>
      <NavbarMenu>
        <Navigation />
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;
