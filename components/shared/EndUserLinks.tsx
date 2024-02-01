"use client";

import Link from "next/link";
import { clsx } from "clsx";
import { userLinks } from "@/constants";
import { usePathname } from "next/navigation";

const EndUserLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {userLinks.map((link) => {
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
    </>
  );
};

export default EndUserLinks;
