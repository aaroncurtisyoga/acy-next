"use client";

import { FC, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { CircleUser } from "lucide-react";

interface UserDropdownProps {
  linksForLoggedInUsers: { href: string; name: string; testId: string }[];
  isSignedIn?: boolean;
  className?: string;
}

const UserDropdown: FC<UserDropdownProps> = ({
  linksForLoggedInUsers,
  isSignedIn = false,
  className = "",
}) => {
  const { signOut } = useClerk();
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    signOut(() => router.push("/"));
    setIsDropdownOpen(false);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Button styling based on auth state
  const buttonClasses = isSignedIn
    ? "flex items-center justify-center p-2 rounded-full bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all duration-200 ease-out"
    : "flex items-center justify-center p-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-200 ease-out";

  // Icon styling based on auth state
  const iconClasses = isSignedIn
    ? "w-6 h-6 text-primary-700 dark:text-white"
    : "w-6 h-6 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200";

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        data-testid="user-menu-button"
        aria-label="User menu"
        aria-expanded={isDropdownOpen}
        aria-haspopup="menu"
        className={buttonClasses}
        onClick={toggleMenu}
      >
        <CircleUser className={iconClasses} />
      </button>

      {isDropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-10"
          role="menu"
          aria-labelledby="user-menu-button"
          data-testid="user-dropdown-menu"
        >
          {isSignedIn &&
            linksForLoggedInUsers.map((link) => (
              <Link
                data-testid={link.testId}
                href={link.href}
                key={link.name}
                className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                role="menuitem"
                onClick={closeDropdown}
              >
                {link.name}
              </Link>
            ))}

          {isSignedIn ? (
            <button
              data-testid="logout-button"
              onClick={handleSignOut}
              className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              role="menuitem"
            >
              Log out
            </button>
          ) : (
            <Link
              data-testid="login-link"
              href="/sign-in"
              className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              role="menuitem"
              onClick={closeDropdown}
            >
              Log in
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
