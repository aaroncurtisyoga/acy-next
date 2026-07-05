"use client";

import { FC } from "react";
import { LogOut, Shield } from "lucide-react";
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
}) => {
  // Only the admin signs in, so signed-out visitors see no account controls
  // here. The admin signs in by going to /admin (redirects to Clerk sign-in).
  if (!isLoaded || !isSignedIn || !user) return null;

  return (
    <>
      <div className="mb-3">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white font-semibold shadow-lg text-lg">
              {user.firstName && user.lastName
                ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                : user.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ||
                  "U"}
            </div>
            {user.publicMetadata?.role === "admin" && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-md">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-base font-semibold text-gray-900">
              {user.fullName ||
                user.emailAddresses?.[0]?.emailAddress?.split("@")[0]}
            </p>
            <p className="text-xs text-gray-500">
              {user.emailAddresses?.[0]?.emailAddress}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4 pb-4 border-b border-gray-200">
        <button
          data-testid="navbar-menu-item-logout"
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all duration-200"
          onClick={onSignOut}
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );
};

export default MobileNavUserSection;
