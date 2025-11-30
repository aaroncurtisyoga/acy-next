"use client";

import { FC } from "react";
import Link from "next/link";
import { NavbarMenuItem } from "@heroui/navbar";
import { LogOut, LogIn, Shield } from "lucide-react";
import { track } from "@vercel/analytics";
import type { UserResource } from "@clerk/types";

interface MobileNavUserSectionProps {
  isSignedIn: boolean;
  isLoaded: boolean;
  user?: UserResource | null;
  onSignOut: () => void;
  onClose: () => void;
}

const MobileNavUserSection: FC<MobileNavUserSectionProps> = ({
  isSignedIn,
  isLoaded,
  user,
  onSignOut,
  onClose,
}) => {
  if (!isLoaded) return null;

  if (isSignedIn && user) {
    return (
      <>
        <NavbarMenuItem className="list-none mb-3">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-inner">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-700 dark:from-gray-500 dark:to-gray-600 flex items-center justify-center text-white font-semibold shadow-lg text-lg">
                {user.firstName && user.lastName
                  ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                  : user.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ||
                    "U"}
              </div>
              {user.publicMetadata?.role === "admin" && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500 dark:bg-amber-400 rounded-full flex items-center justify-center shadow-md">
                  <Shield className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold text-gray-900 dark:text-white">
                {user.fullName ||
                  user.emailAddresses?.[0]?.emailAddress?.split("@")[0]}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user.emailAddresses?.[0]?.emailAddress}
              </p>
            </div>
          </div>
        </NavbarMenuItem>

        <NavbarMenuItem className="list-none mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <button
            data-testid="navbar-menu-item-logout"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200"
            onClick={onSignOut}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </NavbarMenuItem>
      </>
    );
  }

  return (
    <NavbarMenuItem className="list-none mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
      <Link
        data-testid="navbar-menu-item-login"
        className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        href="/sign-in"
        onClick={() => {
          track("auth", {
            action: "sign_in_click",
            source: "mobile_menu",
          });
          onClose();
        }}
      >
        <LogIn className="w-4 h-4" />
        <span>Sign In</span>
      </Link>
    </NavbarMenuItem>
  );
};

export default MobileNavUserSection;
