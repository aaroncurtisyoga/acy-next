"use client";

import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
} from "@nextui-org/react";
import CustomMenuItem from "@/_components/Header/CustomMenuItem";
import Logo from "@/_components/Header/Logo";
import {
  adminLinks,
  authenticatedLinks,
  unauthenticatedLinks,
} from "@/_lib/constants";

const Header: FC = () => {
  const router = useRouter();
  const { isSignedIn, isLoaded, user } = useUser();
  const { signOut } = useClerk();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState(unauthenticatedLinks);

  useEffect(() => {
    // Only update menu items after Clerk has loaded
    if (!isLoaded) return;

    if (isSignedIn) {
      const isAdmin = user?.publicMetadata.role === "admin";
      setMenuItems([
        ...unauthenticatedLinks,
        ...authenticatedLinks,
        ...(isAdmin ? adminLinks : []),
      ]);
    } else {
      setMenuItems(unauthenticatedLinks);
    }
  }, [isLoaded, isSignedIn, user]);

  const handleMenuItemClick = () => setIsMenuOpen(false);

  return (
    <Navbar
      data-testid="navbar"
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      isBordered
      maxWidth="2xl"
    >
      {/* Brand */}
      <NavbarContent>
        <NavbarBrand data-testid="navbar-brand">
          <Link href="/" onClick={handleMenuItemClick}>
            <Logo />
          </Link>
        </NavbarBrand>
      </NavbarContent>
      {/* Hamburger Menu */}
      <NavbarContent justify="end">
        <NavbarMenuToggle
          data-testid="menu-toggle"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
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
      {/* Menu Items */}
      <NavbarMenu>
        {menuItems.map((link, index) => (
          <CustomMenuItem key={`${link.name}-${index}`}>
            <Link
              href={link.href}
              onClick={handleMenuItemClick}
              className="block w-full text-lg font-medium text-gray-800"
            >
              {link.name}
            </Link>
          </CustomMenuItem>
        ))}
        <CustomMenuItem>
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
            <Link href="/sign-in">Login</Link>
          </SignedOut>
        </CustomMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;
