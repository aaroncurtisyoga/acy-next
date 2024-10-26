"use client";

import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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
      data-testid="navbar"
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
        <NavbarBrand data-testid="navbar-brand">
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
        {isLoaded && (
          <>
            {menuItems.map((link, index) => (
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
            <NavbarItem
              data-testid="navbar-login"
              isActive={pathname.includes("/sign-in")}
              className="min-w-[32px]"
            >
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <Link href={"/sign-in"}>Login</Link>
              </SignedOut>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      <NavbarContent className="sm:hidden" justify="end">
        <NavbarMenuToggle
          data-testid="menu-toggle"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
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
    </Navbar>
  );
};

export default Header;
