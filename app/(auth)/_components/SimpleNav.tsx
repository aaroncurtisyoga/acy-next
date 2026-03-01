import { Navbar } from "@heroui/navbar";
import Logo from "@/app/_components/Header/Logo";

const SimpleNav = () => {
  return (
    <Navbar
      isBordered
      maxWidth="2xl"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <Logo />
    </Navbar>
  );
};

export default SimpleNav;
