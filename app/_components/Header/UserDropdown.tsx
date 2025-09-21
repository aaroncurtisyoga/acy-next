"use client";

import { FC, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  CircleUser,
  LogOut,
  Settings,
  Shield,
  ChevronRight,
} from "lucide-react";

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
  const { user } = useUser();
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

  // Modern 2025 button styling with micro-interactions
  const buttonClasses = isSignedIn
    ? "group flex items-center justify-center p-2.5 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/10 hover:from-primary-100 hover:to-primary-200/50 dark:hover:from-primary-900/30 dark:hover:to-primary-800/20 transition-all duration-300 ease-out shadow-sm hover:shadow-md"
    : "group flex items-center justify-center px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-300 ease-out shadow-sm hover:shadow-md";

  // Icon styling with smooth transitions
  const iconClasses = isSignedIn
    ? "w-5 h-5 text-primary-600 dark:text-primary-400 group-hover:rotate-12 transition-all duration-300"
    : "w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all duration-300";

  // Get user initials for avatar
  const userInitials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || "U";

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        data-testid="user-menu-button"
        aria-label={isSignedIn ? "Account menu" : "Sign in"}
        aria-expanded={isDropdownOpen}
        aria-haspopup="menu"
        className={buttonClasses}
        onClick={toggleMenu}
      >
        {isSignedIn ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 dark:from-primary-500 dark:to-primary-700 flex items-center justify-center text-white font-semibold text-sm shadow-inner">
              {userInitials}
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform duration-300" />
          </div>
        ) : (
          <>
            <CircleUser className={iconClasses} />
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Sign In
            </span>
          </>
        )}
      </button>

      {isDropdownOpen && (
        <div
          className="absolute right-0 mt-3 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 z-[9999] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200"
          role="menu"
          aria-labelledby="user-menu-button"
          data-testid="user-dropdown-menu"
        >
          {/* User info header for signed-in users */}
          {isSignedIn && user && (
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 dark:from-primary-500 dark:to-primary-700 flex items-center justify-center text-white font-semibold shadow-inner">
                  {userInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.fullName || user.emailAddresses?.[0]?.emailAddress}
                  </p>
                  {user.publicMetadata?.role === "admin" && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Shield className="w-3 h-3 text-primary-600 dark:text-primary-400" />
                      <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                        Admin
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="py-2">
            {isSignedIn &&
              linksForLoggedInUsers.map((link) => (
                <Link
                  data-testid={link.testId}
                  href={link.href}
                  key={link.name}
                  className="group flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-900/10 hover:text-primary-700 dark:hover:text-primary-400 transition-all duration-200"
                  role="menuitem"
                  onClick={closeDropdown}
                >
                  <Settings className="w-4 h-4 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                  <span className="flex-1">{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all duration-200" />
                </Link>
              ))}

            {isSignedIn ? (
              <>
                <div className="mx-4 my-2 h-px bg-gray-200 dark:bg-gray-700/50" />
                <button
                  data-testid="logout-button"
                  onClick={handleSignOut}
                  className="group flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-200"
                  role="menuitem"
                >
                  <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  <span className="flex-1">Sign out</span>
                </button>
              </>
            ) : (
              <div className="px-4 py-3">
                <Link
                  data-testid="login-link"
                  href="/sign-in"
                  className="block w-full text-center px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                  role="menuitem"
                  onClick={closeDropdown}
                >
                  Sign in to your account
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                  Secure authentication powered by Clerk
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
