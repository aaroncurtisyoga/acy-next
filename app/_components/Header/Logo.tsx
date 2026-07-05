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
        <span className="text-lg font-semibold lowercase tracking-tight text-foreground transition-colors duration-300 hover:text-primary">
          aaron curtis
        </span>
      </Link>
    </div>
  );
};

export default Logo;
