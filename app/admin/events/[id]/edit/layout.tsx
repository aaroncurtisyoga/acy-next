import { ReactNode } from "react";
import { notFound } from "next/navigation";
import prisma from "@/app/_lib/prisma";
import EditEventFormWrapper from "./_components/EditEventFormWrapper";
import type { SerializedEventData } from "./_types";
import { serialize } from "@/app/_lib/utils/serialize";

interface EditLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
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

  // Serialize the Prisma result first to ensure no internal properties remain
  const serializedEvent = serialize(event);

  // Pass serializable data to the client wrapper
  // Dates are passed as ISO strings, converted to ZonedDateTime on client
  const eventData: SerializedEventData = {
    id: serializedEvent.id,
    title: serializedEvent.title,
    description: serializedEvent.description,
    imageUrl: serializedEvent.imageUrl,
    price: serializedEvent.price,
    isFree: serializedEvent.isFree,
    isHostedExternally: serializedEvent.isHostedExternally,
    externalRegistrationUrl: serializedEvent.externalRegistrationUrl,
    maxAttendees: serializedEvent.maxAttendees,
    categoryId: serializedEvent.category?.id ?? null,
    location: serializedEvent.location
      ? {
          formattedAddress: serializedEvent.location.formattedAddress,
          lat: serializedEvent.location.lat,
          lng: serializedEvent.location.lng,
          name: serializedEvent.location.name,
          placeId: serializedEvent.location.placeId,
        }
      : null,
    // After serialize(), Date objects become ISO strings
    startDateTime: serializedEvent.startDateTime
      ? String(serializedEvent.startDateTime)
      : null,
    endDateTime: serializedEvent.endDateTime
      ? String(serializedEvent.endDateTime)
      : null,
  };

  return (
    <EditEventFormWrapper eventData={eventData}>
      {children}
    </EditEventFormWrapper>
  );
}
