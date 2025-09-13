export interface CreateEventData {
  title: string;
  startDateTime: string;
  endDateTime: string;
  price?: string;
  isFree?: boolean;
  category: string;
  location: {
    name: string;
    formattedAddress: string;
    placeId: string;
    lat?: number;
    lng?: number;
  };
  description?: string;
  maxAttendees?: number;
  imageUrl?: string;
  isHostedExternally: boolean;
  externalRegistrationUrl?: string;
}

export interface UpdateEventData {
  _id?: string;
  id?: string;
  title?: string;
  startDateTime?: string;
  endDateTime?: string;
  price?: string;
  isFree?: boolean;
  categoryId?: string;
  category?: string;
  location?: {
    name?: string;
    formattedAddress?: string;
    placeId?: string;
    lat?: number;
    lng?: number;
  };
  description?: string;
  maxAttendees?: number;
  imageUrl?: string;
  isHostedExternally?: boolean;
  externalRegistrationUrl?: string;
}

export interface SyncEventData {
  title: string;
  startDateTime: string | Date;
  endDateTime: string | Date;
  sourceType: string;
  sourceId: string;
  externalUrl: string;
  isExternal: boolean;
  lastSynced: Date;
  locationId: string;
  categoryId: string;
  isFree: boolean;
  isHostedExternally: boolean;
  price: string;
  description: string;
  isActive: boolean;
}
