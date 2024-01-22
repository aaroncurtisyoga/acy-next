import Link from "next/link";
import NavItems from "@/components/shared/nav/NavItems";
import MobileNav from "@/components/shared/nav/MobileNav";
import { SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className={"w-full border-b"}>
      <div className={"wrapper flex items-center justify-between"}>
        <Link href="/" className="sm:32 min-w-fit	">
          <p className={"md:hidden font-bold"}>ACY</p>
          <p className={"hidden md:block font-semibold text-lg"}>
            Aaron Curtis Yoga
          </p>
        </Link>
        <MobileNav />
        {/* Desktop nav*/}
        <nav className={"hidden md:flex justify-end w-full"}>
          <NavItems />
        </nav>
        <div className={""}>
          <div>
            <UserButton afterSignOutUrl={"/"} />
          </div>
          <SignedOut>
            <Button asChild className={"rounded-full"} size={"lg"}>
              <Link href={"/sign-in"}>Login</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
