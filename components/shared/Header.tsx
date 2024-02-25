"use client";

import Link from "next/link";
import { router } from "next/client";
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

export default function Header() {
  const { signOut } = useClerk();
  const { isSignedIn, isLoaded, user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([...userLinks]);

  useEffect(() => {
    if (isSignedIn) {
      setMenuItems((prevState) => [...prevState, ...authenticatedLinks]);
    }
    if (user?.publicMetadata.role === "admin") {
      setMenuItems((prevState) => [...prevState, ...adminLinks]);
    }
  }, [isLoaded, user, isSignedIn]);

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isBordered>
      <NavbarContent>
        <NavbarBrand>
          <p className="sm:hidden font-bold text-inherit">ACY</p>
          <p className="hidden sm:flex font-bold text-inherit">
            Aaron Curtis Yoga
          </p>
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
        <NavbarItem>
          <SignedIn>
            <UserButton afterSignOutUrl={"/"} />
          </SignedIn>
          <SignedOut>
            <Link href={"/sign-in"}>Login</Link>
          </SignedOut>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent className="sm:hidden" justify="end">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((link, index) => (
          <NavbarMenuItem key={`${link.name}-${index}`}>
            <Link href={link.href}>{link.name}</Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <SignedIn>
            <button onClick={() => signOut(() => router.push("/"))}>
              Logout
            </button>
          </SignedIn>
          <SignedOut>
            <Link href={"/sign-in"}>Login</Link>
          </SignedOut>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
