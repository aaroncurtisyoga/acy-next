import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavItems from "@/components/shared/NavItems";
import { Separator } from "@/components/ui/separator";

const MobileNav = () => {
  return (
    <nav className={"md:hidden"}>
      <Sheet>
        <SheetTrigger className="align-middle">
          <Menu className="h-6 w-6" />
        </SheetTrigger>
        <SheetContent className={"flex flex-col gap-6 bg-white md:hidden"}>
          <NavItems />
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default MobileNav;
