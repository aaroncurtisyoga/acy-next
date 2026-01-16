import { ReactNode } from "react";
import { notFound } from "next/navigation";
import prisma from "@/app/_lib/prisma";
import EditEventFormWrapper from "./_components/EditEventFormWrapper";

interface EditLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

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

export default async function EditEventLayout({
  children,
  params,
}: EditLayoutProps) {
  const { id } = await params;

  // Fetch event data once in the layout (server component)
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      category: true,
      location: true,
    },
  });

  if (!event) {
    notFound();
  }

  // Pass serializable data to the client wrapper
  // Dates are passed as ISO strings, converted to ZonedDateTime on client
  const eventData: SerializedEventData = {
    id: event.id,
    title: event.title,
    description: event.description,
    imageUrl: event.imageUrl,
    price: event.price,
    isFree: event.isFree,
    isHostedExternally: event.isHostedExternally,
    externalRegistrationUrl: event.externalRegistrationUrl,
    maxAttendees: event.maxAttendees,
    categoryId: event.category?.id ?? null,
    location: event.location
      ? {
          formattedAddress: event.location.formattedAddress,
          lat: event.location.lat,
          lng: event.location.lng,
          name: event.location.name,
          placeId: event.location.placeId,
        }
      : null,
    startDateTime: event.startDateTime?.toISOString() ?? null,
    endDateTime: event.endDateTime?.toISOString() ?? null,
  };

  return (
    <EditEventFormWrapper eventData={eventData}>
      {children}
    </EditEventFormWrapper>
  );
}
