import Link from "next/link";
import { checkRole } from "@/lib/utils";
import { adminLinks } from "@/constants";

export default async function AdminLinks() {
  if (!checkRole("admin")) {
    return null;
  }

  return (
    <>
      {adminLinks.map((link) => {
        return (
          <li key={link.name} className={"max-sm:w-full"}>
            <Link
              href={link.href}
              className={"flex-center p-medium-16 whitespace-nowrap md:text-lg"}
            >
              <p>{link.name}</p>
            </Link>
          </li>
        );
      })}
    </>
  );
}
