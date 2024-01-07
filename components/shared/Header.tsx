"use client";

import Link from "next/link";
import React from "react";
import NavItems from "@/components/shared/NavItems";
import MobileNav from "@/components/shared/MobileNav";

export default function Header() {
  return (
    <header className={"w-full border-b"}>
      <div className={"wrapper flex items-center justify-between"}>
        <Link href="/" className="sm:32 min-w-fit	">
          <p className={"md:hidden font-bold"}>ACY</p>
          <p className={"hidden md:block font-semibold text-lg max-ine"}>
            Aaron Curtis Yoga
          </p>
        </Link>

        <MobileNav />

        {/* Desktop nav*/}
        <nav className={"hidden md:flex justify-end w-full"}>
          <NavItems />
        </nav>
      </div>
    </header>
  );
}
