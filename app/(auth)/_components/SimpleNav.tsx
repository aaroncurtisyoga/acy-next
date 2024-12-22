import { Navbar } from "@nextui-org/react";
import Logo from "@/_components/Header/Logo";

const SimpleNav = () => {
  return (
    <Navbar isBordered maxWidth="2xl">
      <Logo />
    </Navbar>
  );
};

export default SimpleNav;
