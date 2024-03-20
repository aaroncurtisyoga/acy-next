"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  SignedIn,
  SignedOut,
  useClerk,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import { adminLinks, authenticatedLinks, userLinks } from "@/constants";

interface HeaderProps {
  isSimpleNav?: boolean;
}
export default function Header({ isSimpleNav = false }) {
  const router = useRouter();
  const { signOut } = useClerk();
  const { isSignedIn, isLoaded, user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([...userLinks]);

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      const isAdmin = user?.publicMetadata.role === "admin";
      setMenuItems((prevState) => [...prevState, ...authenticatedLinks]);
      isAdmin && setMenuItems((prevState) => [...prevState, ...adminLinks]);
    } else {
      setMenuItems([...userLinks]);
    }
  }, [isLoaded, user, isSignedIn]);

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isBordered maxWidth="xl">
      <NavbarContent>
        <NavbarBrand>
          <Link href={"/"}>
            <p className="sm:flex font-semibold text-inherit">
              Aaron Curtis Yoga
            </p>
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        {menuItems.map((link, index) => (
          <NavbarItem key={`${link.name}-${index}`}>
            <Link className="w-full" href={link.href}>
              {link.name}
            </Link>
          </NavbarItem>
        ))}
        {!isSimpleNav && (
          <NavbarItem className={"min-w-[32px]"}>
            <SignedIn>
              <UserButton afterSignOutUrl={"/"} />
            </SignedIn>
            <SignedOut>
              <Link href={"/sign-in"}>Login</Link>
            </SignedOut>
          </NavbarItem>
        )}
      </NavbarContent>
      <NavbarContent className="sm:hidden" justify="end">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
      </NavbarContent>
      <NavbarMenu className="items-end">
        {menuItems.map((link, index) => (
          <NavbarMenuItem key={`${link.name}-${index}`}>
            <Link href={link.href}>{link.name}</Link>
          </NavbarMenuItem>
        ))}
        {!isSimpleNav && (
          <NavbarMenuItem>
            <SignedIn>
              <button
                type="button"
                onClick={() => signOut(() => router.push("/"))}
              >
                Logout
              </button>
            </SignedIn>
            <SignedOut>
              <Link href={"/sign-in"}>Login</Link>
            </SignedOut>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </Navbar>
  );
}
