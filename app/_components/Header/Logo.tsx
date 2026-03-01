"use client";

import { FC } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";

const Logo: FC = () => {
  const handleLogoClick = () => {
    track("navigation", {
      action: "logo_click",
      destination: "home",
    });
  };

  return (
    <div data-testid="navbar-brand" className="flex items-center">
      <Link href={"/"} onClick={handleLogoClick}>
        <span className="font-serif font-extrabold text-xl text-slate-700 dark:!text-white hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-300">
          Aaron Curtis Yoga
        </span>
      </Link>
    </div>
  );
};

export default Logo;
