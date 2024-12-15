import { FC, ReactNode } from "react";
import Link from "next/link";
import { NavbarMenuItem } from "@nextui-org/react";
import { NavbarLink } from "@/_lib/types";

interface CustomMenuItemProps {
  children?: ReactNode;
  link?: NavbarLink;
  setIsMenuOpen?: (open: boolean) => void;
}
const CustomMobileMenuItem: FC<CustomMenuItemProps> = ({
  children,
  link,
  setIsMenuOpen,
}) => {
  return (
    <NavbarMenuItem
      className="py-3 px-4 w-full text-right border-b border-gray-400
    focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
      title={link?.name ? link.name : undefined}
    >
      {/* If children gets passed in, use that */}
      {children ? (
        children
      ) : (
        // Otherwise, create a link
        <Link
          href={link.href}
          onClick={() => setIsMenuOpen(false)}
          className="block w-full text-lg font-medium text-gray-800"
        >
          {link.name}
        </Link>
      )}
    </NavbarMenuItem>
  );
};

export default CustomMobileMenuItem;
