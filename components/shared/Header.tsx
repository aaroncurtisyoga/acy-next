import Link from "next/link";
import { SignedOut, UserButton } from "@clerk/nextjs";
import NavItems from "@/components/shared/NavItems";
import MobileNav from "@/components/shared/MobileNav";

export default function Header() {
  return (
    <header className={"w-full border-b"}>
      <div className={"wrapper md:py-4 flex items-center justify-between"}>
        <Link href="/" className="sm:32 min-w-fit	">
          <p className={"md:hidden font-bold"}>ACY</p>
          <p className={"hidden md:block font-semibold text-lg"}>
            Aaron Curtis Yoga
          </p>
        </Link>
        {/*<MobileNav />*/}
        {/* Desktop nav*/}
        <nav className={"flex justify-end w-full"}>
          <NavItems />
        </nav>
        <div className={"pl-5"}>
          <div>
            <UserButton afterSignOutUrl={"/"} />
          </div>
          <SignedOut>
            <button>
              <Link href={"/sign-in"}>Login</Link>
            </button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
