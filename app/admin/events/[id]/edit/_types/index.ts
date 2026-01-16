// Serializable event data to pass from server to client
export interface SerializedEventData {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  price: string | null;
  isFree: boolean;
  isHostedExternally: boolean;
  externalRegistrationUrl: string | null;
  maxAttendees: number | null;
  categoryId: string | null;
  location: {
    formattedAddress: string;
    lat: number | null;
    lng: number | null;
    name: string;
    placeId: string | null;
  } | null;
  startDateTime: string | null;
  endDateTime: string | null;
}
