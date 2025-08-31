import { Category, Event, Location, OrderType } from "@prisma/client";

export type GetAllEventsParams = {
  query: string;
  category: string;
  limit: number;
  page: number;
  isActive?: boolean;
};

export type GetRelatedEventsByCategoryParams = {
  categoryId: string;
  eventId: string;
  limit?: number;
  page: number | string;
};

// ====== CATEGORY PARAMS
export type CreateCategoryParams = {
  categoryName: string;
};

// ====== ORDER PARAMS
export type CheckoutOrderParams = {
  buyerId: string;
  eventId?: string;
  isFree: boolean;
  name: string;
  price: string;
  type: OrderType;
};

export type CreateOrderParams = {
  buyerId: string;
  createdAt: Date;
  eventId?: string;
  stripeId: string;
  totalAmount: string;
  type: OrderType;
};

export type GetOrdersByEventParams = {
  eventId: string;
  searchString: string;
};

export type GetOrdersByUserParams = {
  userId: string | null;
  limit?: number;
  page: string | number | null;
};

// ====== URL QUERY PARAMS
export type UrlQueryParams = {
  params: string;
  key: string;
  value: string | null;
};

export type RemoveUrlQueryParams = {
  params: string;
  keysToRemove: string[];
};

export type SearchParamProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export type TravelMode = "driving" | "walking" | "transit" | "bicycling";

export interface TravelOption {
  travelMode: TravelMode;
  icon: React.ElementType;
}

export type PlaceDetails = {
  formattedAddress: string;
  lat: number;
  lng: number;
  name: string;
  placeId: string;
};

export type EventWithLocationAndCategory = Event & {
  location: Location;
  category: Category;
};

export interface GetAllEventsResponse {
  data: EventWithLocationAndCategory[];
  totalPages: number;
  hasFiltersApplied: boolean;
  totalCount: number;
}

export type NavbarLink = {
  name: string;
  href: string;
  testId: string;
};
