"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { userLinks } from "@/constants";

const EndUserLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {userLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <li key={link.name}>
            <Link href={link.href}>
              <p>{link.name}</p>
            </Link>
          </li>
        );
      })}
    </>
  );
};

export default EndUserLinks;
