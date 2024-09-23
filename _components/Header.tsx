"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FC, useEffect, useState } from "react";
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
import { adminLinks, authenticatedLinks, userLinks } from "@/_lib/constants";
import { merriweather } from "@/app/fonts";

const Header: FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { isSignedIn, isLoaded, user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([...userLinks]);

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      const isAdmin = user?.publicMetadata.role === "admin";
      setMenuItems(() => [
        ...userLinks,
        ...authenticatedLinks,
        ...(isAdmin ? adminLinks : []),
      ]);
    } else {
      setMenuItems([...userLinks]);
    }
  }, [isLoaded, user, isSignedIn]);

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      isBordered
      maxWidth="xl"
      classNames={{
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
    >
      <NavbarContent>
        {/* Todo: Replace w/ an actual Logo */}
        <NavbarBrand>
          <Link href={"/"}>
            <h1
              className={`sm:flex font-extrabold text-xl ${merriweather.className}`}
            >
              Aaron Curtis Yoga
            </h1>
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        {menuItems.map((link, index) => (
          <NavbarItem
            key={`${link.name}-${index}`}
            isActive={pathname.includes(link.href)}
          >
            <Link className="w-full" href={link.href}>
              {link.name}
            </Link>
          </NavbarItem>
        ))}
        <NavbarItem className={"min-w-[32px]"}>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Link href={"/sign-in"}>Login</Link>
          </SignedOut>
        </NavbarItem>
      </NavbarContent>
      {/* Content below if for Mobile Nav */}
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
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;
