import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Bars3Icon } from "@heroicons/react/24/solid";
import NavItems from "@/components/shared/NavItems";

const MobileNav = () => {
  return (
    <nav className={"md:hidden"}>
      <Sheet>
        <SheetTrigger className="align-middle">
          <Bars3Icon className="h-6 w-6" />
        </SheetTrigger>
        <SheetContent className={"flex flex-col gap-6 bg-white md:hidden"}>
          <NavItems />
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default MobileNav;
