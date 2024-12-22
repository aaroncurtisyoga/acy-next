"use client";

import { FC } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { NavbarContent, NavbarItem } from "@nextui-org/react";
import UserDropdownMenu from "@/_components/Header/UserDropdownMenu";
import { unauthenticatedLinks } from "@/_lib/constants";

interface DesktopNavbarContentProps {
  authenticatedLinks: any[];
}

const DesktopNavbarContent: FC<DesktopNavbarContentProps> = ({
  authenticatedLinks,
}) => {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <NavbarContent className="hidden sm:flex gap-4" justify="end">
      {/* Unauthenticated Links */}
      {unauthenticatedLinks.map((link, index) => (
        <NavbarItem
          data-testid={`navbar-item-${link.testId}`}
          key={`${link.name}-${index}`}
          isActive={pathname.includes(link.href)}
        >
          <Link className="w-full" href={link.href}>
            {link.name}
          </Link>
        </NavbarItem>
      ))}

      {/* Dropdown for Authenticated Links */}
      <UserDropdownMenu
        authenticatedLinks={authenticatedLinks}
        isSignedIn={isSignedIn}
        signOut={() => signOut(() => router.push("/"))}
      />
    </NavbarContent>
  );
};

export default DesktopNavbarContent;
