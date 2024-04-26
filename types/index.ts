export type CreateUserParams = {
  clerkId: string;
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
};

export type UpdateUserParams = {
  firstName: string;
  lastName: string;
  photo: string;
};

export type DeleteEventParams = {
  eventId: string;
  path: string;
};

export type GetAllEventsParams = {
  query: string;
  category: string;
  limit: number;
  page: number;
};

export type GetRelatedEventsByCategoryParams = {
  categoryId: string;
  eventId: string;
  limit?: number;
  page: number | string;
};

export type Event = {
  _id: string;
  category: {
    _id: string;
    name: string;
  };
  description: string;
  endDateTime: Date;
  imageUrl: string;
  isFree: boolean;
  location: string;
  maxAttendees: number;
  price: string;
  title: string;
  startDateTime: Date;
  url: string;
};

// ====== CATEGORY PARAMS
export type CreateCategoryParams = {
  categoryName: string;
};

// ====== ORDER PARAMS
export type CheckoutOrderParams = {
  eventTitle: string;
  eventId: string;
  price: string;
  isFree: boolean;
  buyerId: string;
};

export type CreateOrderParams = {
  buyerId: string;
  createdAt: Date;
  eventId: string;
  status: string;
  stripeId: string;
  totalAmount: string;
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
  geometry: {
    lat: number;
    lng: number;
  };
  name: string;
  placeId: string;
};
