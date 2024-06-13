import Link from "next/link";
import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";

const SimpleNav = () => {
  return (
    <Navbar isBordered maxWidth="xl">
      <NavbarContent>
        <NavbarBrand>
          <Link href={"/"}>
            <p className="sm:flex font-semibold text-inherit">
              Aaron Curtis Yoga
            </p>
          </Link>
        </NavbarBrand>
      </NavbarContent>
    </Navbar>
  );
};

export default SimpleNav;
