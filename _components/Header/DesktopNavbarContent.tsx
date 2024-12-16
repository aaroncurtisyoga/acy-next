"use client";

import { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  NavbarContent,
  NavbarItem,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
} from "@nextui-org/react";
import { User } from "lucide-react";
import { unauthenticatedLinks } from "@/_lib/constants";

interface DesktopNavbarContentProps {
  authenticatedLinks: { name: string; href: string; testId: string }[];
}

const DesktopNavbarContent: FC<DesktopNavbarContentProps> = ({
  authenticatedLinks,
}) => {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useClerk();

  // @ts-ignore
  return (
    <NavbarContent className="hidden sm:flex gap-4" justify="end">
      {/* Auth and Unauthenticated Links */}
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
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <button aria-label="User menu" className="flex items-center">
            <User className="w-6 h-6" />
          </button>
        </DropdownTrigger>
        <DropdownMenu aria-label="User Menu" variant="flat">
          {/* ts-ignore */}
          {authenticatedLinks.map((link) => (
            <DropdownItem href={link.href} title={link.name} key={link.name}>
              {link.name}
            </DropdownItem>
          ))}
          {isSignedIn ? (
            <DropdownItem
              key="logout"
              title={"Log out"}
              onPress={() => signOut(() => router.push("/"))}
            >
              Log out
            </DropdownItem>
          ) : (
            <DropdownItem key="login" title={"Log In"} href="/sign-in">
              Log in
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    </NavbarContent>
  );
};

export default DesktopNavbarContent;
