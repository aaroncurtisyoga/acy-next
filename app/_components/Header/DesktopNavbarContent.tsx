"use client";

import { FC, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavbarContent, NavbarItem } from "@heroui/react";
import { unauthenticatedLinks } from "@/app/_lib/constants";
// import { HiOutlineMail } from "react-icons/hi";
// import NewsletterModal from "@/app/_components/NewsletterModal";

interface DesktopNavbarContentProps {
  children: ReactNode;
}

const DesktopNavbarContent: FC<DesktopNavbarContentProps> = ({ children }) => {
  const pathname = usePathname();
  // const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <NavbarContent
        className="hidden sm:flex gap-4"
        justify="end"
        data-testid="navbar-menu-desktop"
      >
        {/* Navigation links */}
        {unauthenticatedLinks.map((link, index) => (
          <NavbarItem
            key={`${link.name}-${index}`}
            isActive={pathname.includes(link.href)}
          >
            <Link
              className="w-full"
              href={link.href}
              aria-label={link.name}
              data-testid={`${link.testId}`}
            >
              {link.name}
            </Link>
          </NavbarItem>
        ))}

        {/* Newsletter button */}
        {/*<Button*/}
        {/*  onPress={onOpen}*/}
        {/*  color="primary"*/}
        {/*  variant="flat"*/}
        {/*  startContent={<HiOutlineMail className="w-4 h-4" />}*/}
        {/*  className="font-medium"*/}
        {/*>*/}
        {/*  Newsletter*/}
        {/*</Button>*/}

        {/* User dropdown */}
        {children}
      </NavbarContent>

      {/* Newsletter Modal */}
      {/*<NewsletterModal isOpen={isOpen} onOpenChange={onOpenChange} />*/}
    </>
  );
};

export default DesktopNavbarContent;
