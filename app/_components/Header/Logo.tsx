"use client";

import { FC } from "react";
import Link from "next/link";
import { NavbarBrand } from "@heroui/react";
import { merriweather } from "@/app/fonts";

const Logo: FC = () => {
  return (
    <NavbarBrand data-testid="navbar-brand">
      <Link href={"/"}>
        <span
          className={`font-extrabold text-xl text-slate-700 dark:!text-white hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300 ${merriweather.className}`}
        >
          Aaron Curtis Yoga
        </span>
      </Link>
    </NavbarBrand>
  );
};

export default Logo;
