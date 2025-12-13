"use client";

import { FC } from "react";
import Link from "next/link";
import { NavbarBrand } from "@heroui/navbar";
import { track } from "@vercel/analytics";

const Logo: FC = () => {
  const handleLogoClick = () => {
    track("navigation", {
      action: "logo_click",
      destination: "home",
    });
  };

  return (
    <NavbarBrand data-testid="navbar-brand">
      <Link href={"/"} onClick={handleLogoClick}>
        <span className="font-serif font-extrabold text-xl text-slate-700 dark:!text-white hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300">
          Aaron Curtis Yoga
        </span>
      </Link>
    </NavbarBrand>
  );
};

export default Logo;
