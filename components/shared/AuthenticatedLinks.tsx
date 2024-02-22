"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn } from "@clerk/nextjs";
import { authenticatedLinks } from "@/constants";

const UserLinks = () => {
  const pathname = usePathname();

  return (
    <SignedIn>
      {authenticatedLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <li key={link.name}>
            <Link href={link.href}>
              <p>{link.name}</p>
            </Link>
          </li>
        );
      })}
    </SignedIn>
  );
};

export default UserLinks;
