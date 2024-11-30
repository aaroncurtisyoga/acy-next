import Link from "next/link";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
} from "@nextui-org/react";
import MenuItems from "@/_components/MenuItems";
import { merriweather } from "@/app/fonts";

const Header = () => {
  return (
    <Navbar data-testid="navbar" isBordered maxWidth="xl">
      <NavbarContent>
        <NavbarBrand data-testid="navbar-brand">
          <Link href="/">
            <h1
              className={`sm:flex font-extrabold text-xl ${merriweather.className}`}
            >
              Aaron Curtis Yoga
            </h1>
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarMenuToggle aria-label="Open menu" />
      </NavbarContent>
      <NavbarMenu>
        <MenuItems />
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;
