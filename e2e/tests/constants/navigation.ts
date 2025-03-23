/**
 * Common unauthenticated links used in navigation tests
 */
export const unauthenticatedLinks = [
  {
    name: "Private Sessions",
    href: "/private-sessions",
    testId: "private-sessions-link",
  },
];

/**
 * Common authenticated links for regular users
 */
export const userLinks = [
  {
    name: "Account",
    href: "/account",
    testId: "account-link",
  },
  // Add more user-specific links as needed
];

/**
 * Common authenticated links for admin users
 */
export const adminLinks = [
  {
    name: "Admin",
    href: "/admin",
    testId: "admin-link",
  },
  // Add more admin-specific links as needed
];
