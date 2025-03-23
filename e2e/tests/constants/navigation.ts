export interface NavLink {
  name: string;
  href: string;
  testId: string;
}

const baseUnauthenticatedLinks = [
  {
    name: "Private Sessions",
    href: "/private-sessions",
    baseTestId: "private-sessions-link",
  },
];

const baseUserLinks = [
  {
    name: "Account",
    href: "/account",
    baseTestId: "account-link",
  },
];

const baseAdminLinks = [
  {
    name: "Admin",
    href: "/admin",
    baseTestId: "admin-link",
  },
];

/**
 * Mobile testIds are prefixed with "navbar-menu-item-" to avoid conflicts
 */
function getFormattedLinks(
  links: Array<{ name: string; href: string; baseTestId: string }>,
  isMobile: boolean,
): NavLink[] {
  return links.map((link) => ({
    name: link.name,
    href: link.href,
    testId: isMobile
      ? `navbar-menu-item-${link.baseTestId}`
      : `${link.baseTestId}`,
  }));
}

export function getUnauthenticatedLinks(isMobile: boolean): NavLink[] {
  return getFormattedLinks(baseUnauthenticatedLinks, isMobile);
}

export function getUserLinks(isMobile: boolean): NavLink[] {
  return getFormattedLinks(baseUserLinks, isMobile);
}

export function getAdminLinks(isMobile: boolean): NavLink[] {
  return getFormattedLinks(baseAdminLinks, isMobile);
}
