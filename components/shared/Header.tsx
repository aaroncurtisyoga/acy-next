"use client";

import { router } from "next/client";
import {
  SignedIn,
  SignedOut,
  useClerk,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useCallback, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
} from "@nextui-org/react";
import { adminLinks, authenticatedLinks, userLinks } from "@/constants";

export default function App() {
  const { signOut } = useClerk();
  const { isSignedIn, isLoaded, user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuItems = useCallback(() => {
    const menuItems = [...userLinks];
    if (isLoaded && isSignedIn) menuItems.push([...authenticatedLinks]);
    if (isLoaded && user?.publicMetadata.role === "admin") {
      menuItems.push([...adminLinks]);
    }
    return menuItems;
  }, [isLoaded, isSignedIn, user]);
  const list = menuItems();
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
        {list.map(({ name, href }, index) => (
          <NavbarMenuItem key={`${name}-${index}`}>
            <Link color="primary" className="w-full" href={href} size="lg">
              {name}
            </Link>
          </NavbarMenuItem>
        ))}
        {/*<NavbarMenuItem>
          <SignedIn>
            <button onClick={() => signOut(() => router.push("/"))}>
              Logout
            </button>
            <Link href={"/sign-in"}>Logout</Link>
          </SignedIn>
          <SignedOut>
            <Link href={"/sign-in"}>Login</Link>
          </SignedOut>
        </NavbarMenuItem>*/}
      </NavbarMenu>
    </Navbar>
  );
}
