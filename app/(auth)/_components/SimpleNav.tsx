import { Navbar } from "@heroui/react";
import Logo from "@/app/_components/Header/Logo";

const SimpleNav = () => {
  return (
    <Navbar isBordered maxWidth="2xl">
      <Logo />
    </Navbar>
  );
};

export default SimpleNav;
