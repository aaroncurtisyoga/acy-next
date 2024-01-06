"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { navLinks } from "@/constants";

const NavItems = () => {
  const pathname = usePathname();
  // todo: check & see how tailwind example renders there nav items b/c id dont like idea of adding uncessary ul and li if it's not required and just going to be some boilerplate html thats never actually useful for anything
  return (
    <ul className="flex w-full flex-col items-start gap-5 md:flex-row md:flex-between">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <li key={link.name}>
            <Link
              href={link.href}
              className={clsx("flex-center p-medium-16 whitespace-nowrap", {
                "text-primary-500": isActive === true,
              })}
            >
              <p>{link.name}</p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;
