"use client";

import { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@nextui-org/react";
import { userLinks } from "@/constants";
import { UserButton } from "@clerk/nextjs";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const getMenuItems = () => {
    const menuItems = [...userLinks];
    // todo: if signedIn, show My Profile links
    // todo: if admin, show Admin links
    return menuItems;
  };
  const menuItems = getMenuItems();

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
          <UserButton afterSignOutUrl={"/"} />
        </NavbarItem>
      </NavbarContent>
      <NavbarContent className="sm:hidden" justify="end">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
              }
              className="w-full"
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <Link color={"danger"} className="w-full" href="#" size="lg">
            Logout
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
