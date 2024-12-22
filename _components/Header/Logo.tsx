import { FC } from "react";
import Link from "next/link";
import { NavbarBrand, NavbarContent } from "@nextui-org/react";
import { merriweather } from "@/app/fonts";

interface LogoProps {
  setIsMenuOpen?: (value: boolean) => void;
}

const Logo: FC<LogoProps> = ({ setIsMenuOpen }) => {
  return (
    <NavbarContent>
      <NavbarBrand data-testid="navbar-brand">
        <Link href={"/"} onClick={() => setIsMenuOpen(false)}>
          <span
            className={`sm:flex font-extrabold text-xl ${merriweather.className}`}
          >
            Aaron Curtis Yoga
          </span>
        </Link>
      </NavbarBrand>
    </NavbarContent>
  );
};

export default Logo;
