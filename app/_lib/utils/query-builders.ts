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

export function buildWeekDateRange(weekStart: Date) {
  const start = new Date(weekStart);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return { start, end };
}

export function buildMonthGridRange(year: number, month: number) {
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(gridStart.getDate() - gridStart.getDay() - 1);
  gridStart.setHours(0, 0, 0, 0);
  const gridEnd = new Date(lastOfMonth);
  gridEnd.setDate(gridEnd.getDate() + (6 - gridEnd.getDay()) + 1);
  gridEnd.setHours(23, 59, 59, 999);
  return { gridStart, gridEnd };
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
