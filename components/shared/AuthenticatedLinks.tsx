"use client";

import Link from "next/link";
import { clsx } from "clsx";
import { authenticatedLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { SignedIn } from "@clerk/nextjs";

const UserLinks = () => {
  const pathname = usePathname();

  return (
    <SignedIn>
      {authenticatedLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <li key={link.name} className={"max-sm:w-full"}>
            <Link
              href={link.href}
              className={clsx("flex-center whitespace-nowrap", {
                "text-blue-500": isActive === true,
              })}
            >
              <p>{link.name}</p>
            </Link>
          </li>
        );
      })}
    </SignedIn>
  );
};

export default UserLinks;
