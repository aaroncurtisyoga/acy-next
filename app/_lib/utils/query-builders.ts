import { Prisma } from "@prisma/client";

export function buildEventSearchConditions(
  query?: string,
  category?: string,
  isActive?: boolean,
) {
  const conditions: Prisma.EventWhereInput[] = [];

  if (query) {
    conditions.push({ title: { contains: query } });
  }

  if (category) {
    conditions.push({ category: { name: { equals: category } } });
  }

  if (typeof isActive === "boolean") {
    conditions.push({ isActive });
  }

  conditions.push({ endDateTime: { gt: new Date() } });

  return { AND: conditions };
}

export function buildUserSearchConditions(query?: string) {
  if (!query) return {};

  return {
    OR: [
      { firstName: { contains: query, mode: "insensitive" as const } },
      { lastName: { contains: query, mode: "insensitive" as const } },
      { email: { contains: query, mode: "insensitive" as const } },
    ],
  };
}

export function buildOrderSearchConditions(
  searchString?: string,
  eventId?: string,
) {
  const conditions: Prisma.OrderWhereInput[] = [];

  if (eventId) {
    conditions.push({ event: { id: eventId } });
  }

  if (searchString) {
    conditions.push({
      OR: [
        {
          buyer: {
            firstName: { contains: searchString, mode: "insensitive" as const },
          },
        },
        {
          buyer: {
            lastName: { contains: searchString, mode: "insensitive" as const },
          },
        },
      ],
    });
  }

  return conditions.length > 0 ? { AND: conditions } : {};
}
