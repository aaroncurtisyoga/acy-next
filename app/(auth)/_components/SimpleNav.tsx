import { Navbar } from "@heroui/navbar";
import Logo from "@/app/_components/Header/Logo";

const SimpleNav = () => {
  return (
    <Navbar isBordered maxWidth="2xl">
      <Logo />
    </Navbar>
  );
};

export default SimpleNav;
