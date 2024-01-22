"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { navLinks } from "@/constants";
import { checkRole } from "@/lib/utils";

const NavItems = () => {
  const pathname = usePathname();
  const isAdmin = checkRole("admin");

  return (
    <ul className="flex w-full flex-col items-start gap-5 max-sm:mt-4 md:flex-row md:justify-end">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <li key={link.name} className={"max-sm:w-full"}>
            <Link
              href={link.href}
              className={clsx(
                "flex-center p-medium-16 whitespace-nowrap md:text-lg",
                {
                  "text-blue-500": isActive === true,
                },
              )}
            >
              <p>{link.name}</p>
            </Link>
          </li>
        );
      })}
      {isAdmin && (
        <>
          <li className={"max-sm:w-full"}>
            <Link
              href={"//events/create"}
              className={clsx(
                "flex-center p-medium-16 whitespace-nowrap md:text-lg",
                {
                  "text-blue-500": pathname === "/events/create",
                },
              )}
            >
              <p>Admin</p>
            </Link>
          </li>
          <li className={"max-sm:w-full"}>
            <Link
              href={"/admin"}
              className={clsx(
                "flex-center p-medium-16 whitespace-nowrap md:text-lg",
                {
                  "text-blue-500": pathname === "/admin",
                },
              )}
            >
              <p>Admin</p>
            </Link>
          </li>
        </>
      )}
    </ul>
  );
};

export default NavItems;
