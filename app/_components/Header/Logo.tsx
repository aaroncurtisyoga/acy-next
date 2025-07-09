"use client";

import { FC } from "react";
import Link from "next/link";
import { NavbarBrand } from "@heroui/react";
import { merriweather } from "@/app/fonts";

interface LogoProps {
  setIsMenuOpen?: (value: boolean) => void;
}

const Logo: FC<LogoProps> = ({ setIsMenuOpen }) => {
  return (
    <NavbarBrand data-testid="navbar-brand">
      <Link href={"/"} onClick={() => setIsMenuOpen(false)}>
        <span
          className={`sm:flex font-extrabold text-xl text-slate-700 dark:text-gray-200 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300 ${merriweather.className}`}
        >
          Aaron Curtis Yoga
        </span>
      </Link>
    </NavbarBrand>
  );
};

export default Logo;
