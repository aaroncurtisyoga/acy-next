"use client";

import { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import {
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";

interface MobileNavbarContentProps {
  isMenuOpen: boolean;
  menuItems: { name: string; href: string; testId: string }[];
  setIsMenuOpen: (open: boolean) => void;
}

const MobileNavbarContent: FC<MobileNavbarContentProps> = ({
  isMenuOpen,
  menuItems,
  setIsMenuOpen,
}) => {
  const router = useRouter();
  const { signOut } = useClerk();

  return (
    <>
      <NavbarContent className="" justify="end">
        <NavbarMenuToggle
          data-testid="menu-toggle"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-pressed={isMenuOpen}
          className="w-10 h-10 p-2 rounded-full flex items-center justify-center tap-highlight-transparent outline-none focus:outline-none focus:ring-2 focus:ring-primary transition-transform"
        >
          <span className="sr-only">
            {isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          </span>
          <span
            className={`pointer-events-none flex flex-col items-center justify-center transition-transform duration-150 ${
              isMenuOpen ? "rotate-45" : "rotate-0"
            }`}
          >
            <span
              className={`block h-px w-6 bg-current transition-transform ${
                isMenuOpen ? "translate-y-px" : "-translate-y-1"
              }`}
            />
            <span
              className={`block h-px w-6 bg-current transition-transform ${
                isMenuOpen
                  ? "-rotate-90 translate-y-0"
                  : "rotate-0 translate-y-1"
              }`}
            />
          </span>
        </NavbarMenuToggle>
      </NavbarContent>
      <NavbarMenu data-testid="navbar-menu" className="items-end w-full">
        {menuItems.map((link, index) => (
          <NavbarMenuItem
            data-testid={`menu-item-${link.testId}`}
            key={`${link.name}-${index}`}
            className="py-3 px-4 w-full text-right border-b border-gray-400 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <Link
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-lg font-medium text-gray-800"
            >
              {link.name}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem
          data-testid="menu-login"
          className="py-3 px-4 w-full text-right border-b border-gray-400 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <SignedIn>
            <button
              type="button"
              onClick={() => signOut(() => router.push("/"))}
              className="w-full text-lg font-medium text-gray-800 text-right"
            >
              Logout
            </button>
          </SignedIn>
          <SignedOut>
            <Link
              href={"/sign-in"}
              className="block w-full text-lg font-medium text-gray-800"
            >
              Login
            </Link>
          </SignedOut>
        </NavbarMenuItem>
      </NavbarMenu>
    </>
  );
};

export default MobileNavbarContent;
