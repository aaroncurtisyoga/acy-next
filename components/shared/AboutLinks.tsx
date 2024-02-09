"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { aboutLinks } from "@/constants";
import { clsx } from "clsx";

function AboutLinks() {
  const pathname = usePathname();

  return (
    <div className={"flex pt-[20px] gap-3 wrapper"}>
      {aboutLinks.map((link) => {
        const isActive = pathname.includes(link.href);
        return (
          <li
            key={link.name}
            className={"font-medium text-blue-600 hover:underline"}
          >
            <Link
              href={link.href}
              className={clsx("flex-center whitespace-nowrap", {
                underline: isActive === true,
              })}
            >
              <p>{link.name}</p>
            </Link>
          </li>
        );
      })}
    </div>
  );
}

export default AboutLinks;
