import Link from "next/link";
import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import { merriweather } from "@/app/fonts";

const SimpleNav = () => {
  return (
    <Navbar isBordered maxWidth="xl">
      <NavbarContent>
        <NavbarBrand>
          <Link href={"/"}>
            <p
              className={`sm:flex font-semibold text-inherit ${merriweather.className}`}
            >
              Aaron Curtis Yoga
            </p>
          </Link>
        </NavbarBrand>
      </NavbarContent>
    </Navbar>
  );
};

export default SimpleNav;
