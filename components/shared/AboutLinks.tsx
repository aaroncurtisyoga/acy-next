"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { aboutLinks } from "@/constants";
import { clsx } from "clsx";

function AboutLinks() {
  const pathname = usePathname();

  return (
    <div className={"flex pt-[20px] gap-5 wrapper"}>
      {aboutLinks.map((link) => {
        const isActive = pathname.includes(link.href);
        return (
          <li key={link.name} className={"underline hover:text-blue-500"}>
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
    </div>
  );
}

export default AboutLinks;
