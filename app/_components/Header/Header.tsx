"use client";

import { FC, useState } from "react";
// import { useUser } from "@clerk/nextjs";
import { Navbar } from "@heroui/react";
import DesktopNavbarContent from "@/app/_components/Header/DesktopNavbarContent";
import Logo from "@/app/_components/Header/Logo";
import MobileNavbarContent from "@/app/_components/Header/MobileNavbarContent";
// import UserDropdown from "@/app/_components/Header/UserDropdown";
// import { adminLinks, authenticatedLinks } from "@/app/_lib/constants";

// HeaderProgressBar Component
// const HeaderProgressBar: FC = () => {
//   const pathname = usePathname();

//   // Check if we're in the private sessions flow
//   const isPrivateSessionsFlow = pathname.startsWith("/private-sessions");

//   if (!isPrivateSessionsFlow) return null;

//   // Map routes to steps
//   const getStepFromPath = (
//     path: string,
//   ): { current: number; total: number } => {
//     const stepMap: { [key: string]: number } = {
//       "/private-sessions/welcome": 1,
//       "/private-sessions/sign-in": 2,
//       "/private-sessions/select-package": 3,
//       "/private-sessions/checkout": 4,
//     };

//     const current = stepMap[path] || 1;
//     return { current, total: 4 };
//   };

//   const { current, total } = getStepFromPath(pathname);
//   const progressPercentage = (current / total) * 100;

//   return (
//     <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-200 dark:bg-gray-700 z-10">
//       <div
//         className="h-full bg-primary transition-all duration-300 ease-out"
//         style={{ width: `${progressPercentage}%` }}
//       />
//     </div>
//   );
// };

const Header: FC = () => {
  // const { isSignedIn, isLoaded, user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [linksForLoggedInUsers, setLinksForLoggedInUsers] = useState<
  //   Array<{
  //     name: string;
  //     href: string;
  //     testId: string;
  //   }>
  // >([]);

  // useEffect(() => {
  //   // Wait for Clerk to load
  //   if (!isLoaded) return;

  //   // Update authenticated menu items based on user's role
  //   if (isSignedIn) {
  //     const isAdmin = user?.publicMetadata?.role === "admin";
  //     setLinksForLoggedInUsers([
  //       ...authenticatedLinks,
  //       ...(isAdmin ? adminLinks : []),
  //     ]);
  //   } else {
  //     // Reset authenticated menu items if user is not signed in
  //     setLinksForLoggedInUsers([]);
  //   }
  // }, [isLoaded, user, isSignedIn]);

  return (
    <div className="relative">
      <Navbar
        data-testid="navbar"
        onMenuOpenChange={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
        isBordered
        maxWidth="2xl"
        className="shadow-sm static border-b border-slate-200 dark:border-slate-700"
        classNames={{
          base: "static",
          wrapper: "px-6 py-4",
          item: [
            "flex",
            "relative",
            "h-full",
            "items-center",
            "px-3",
            "py-2",
            "rounded-lg",
            "text-gray-700",
            "dark:text-gray-300",
            "data-[active=true]:text-slate-800",
            "data-[active=true]:bg-slate-100",
            "data-[active=true]:font-normal",
            "dark:data-[active=true]:text-white",
            "dark:data-[active=true]:bg-gray-800",
            "hover:text-slate-700",
            "hover:bg-slate-50",
            "dark:hover:text-white",
            "dark:hover:bg-gray-800/50",
            "transition-all",
            "duration-200",
          ],
        }}
      >
        <Logo setIsMenuOpen={setIsMenuOpen} />

        {/* Mobile navigation */}
        <MobileNavbarContent
          linksForLoggedInUsers={[]}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          isSignedIn={false}
        />

        {/* Desktop navigation */}
        <DesktopNavbarContent>{null}</DesktopNavbarContent>
      </Navbar>

      {/* Progress Bar */}
      {/* <HeaderProgressBar /> */}
    </div>
  );
};

export default Header;
