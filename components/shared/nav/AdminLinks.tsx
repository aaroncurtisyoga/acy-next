import Link from "next/link";
import { checkRole } from "@/lib/utils";
import { clsx } from "clsx";
import { adminLinks } from "@/constants";

const AdminLinks = () => {
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
              className={clsx(
                "flex-center p-medium-16 whitespace-nowrap md:text-lg",
                {
                  "text-blue-500": link.href === "/admin/dashboard",
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

export default AdminLinks;
