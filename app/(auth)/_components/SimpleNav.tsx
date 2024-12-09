import Link from "next/link";
import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import Logo from "@/_components/Header/Logo";

const SimpleNav = () => {
  return (
    <Navbar isBordered maxWidth="xl">
      <NavbarContent>
        <NavbarBrand>
          <Link href={"/"}>
            <Logo />
          </Link>
        </NavbarBrand>
      </NavbarContent>
    </Navbar>
  );
};

export default SimpleNav;
