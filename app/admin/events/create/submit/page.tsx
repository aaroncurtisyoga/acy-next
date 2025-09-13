"use client";

import { FC, FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { Link as HeroUiLink } from "@heroui/react";
import { useFormContext } from "react-hook-form";
import { createEvent } from "@/app/_lib/actions/event.actions";
import { CreateEventData } from "@/app/_lib/types/event";
import { handleError } from "@/app/_lib/utils";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";
import EventFormWrapper from "@/app/admin/events/_components/EventForm/EventFormWrapper";
import EventCard from "@/app/(root)/_components/EventCard";
import { EventWithLocationAndCategory } from "@/app/_lib/types";
import { getAllCategories } from "@/app/_lib/actions/category.actions";

const SubmitStep: FC = () => {
  const router = useRouter();
  const { getValues, reset } = useFormContext<EventFormValues>();
  const [categoryName, setCategoryName] = useState<string>("Category");

  useEffect(() => {
    const fetchCategoryName = async () => {
      const formValues = getValues();
      if (formValues.category) {
        try {
          const categories = await getAllCategories();
          const category = categories?.find(
            (cat: any) => cat.id === formValues.category,
          );
          if (category) {
            setCategoryName(category.name);
          }
        } catch (error) {
          console.error("Failed to fetch category:", error);
        }
      }
    };
    fetchCategoryName();
  }, [getValues]);

  async function createNewEvent() {
    const formValues = getValues();

    try {
      // Convert ZonedDateTime objects to ISO strings for serialization
      const eventData: CreateEventData = {
        ...formValues,
        startDateTime: formValues.startDateTime?.toString
          ? formValues.startDateTime.toString()
          : formValues.startDateTime,
        endDateTime: formValues.endDateTime?.toString
          ? formValues.endDateTime.toString()
          : formValues.endDateTime,
        isFree: formValues.isFree ?? false,
      } as CreateEventData;

      const newEvent = await createEvent({
        event: eventData,
        path: "/events",
      });

      if (newEvent) {
        reset(); // Clear form state
        router.push(`/`);
      }
    } catch (error) {
      handleError(error);
    }
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createNewEvent();
  };

  const handleCancel = () => {
    reset(); // Clear form state
    router.push("/admin/events"); // Go back to events list
  };

  const formValues = getValues();

  // Transform form values to match EventCard expected format
  const eventPreview: EventWithLocationAndCategory = {
    id: "preview",
    title: formValues.title || "",
    description: formValues.description || "",
    imageUrl: formValues.imageUrl || "/images/placeholder-event.jpg",
    startDateTime: formValues.startDateTime
      ? new Date(formValues.startDateTime.toString())
      : new Date(),
    endDateTime: formValues.endDateTime
      ? new Date(formValues.endDateTime.toString())
      : new Date(),
    price: formValues.price || "0",
    isFree: formValues.isFree || false,
    isHostedExternally: formValues.isHostedExternally || false,
    externalRegistrationUrl: formValues.externalRegistrationUrl || null,
    maxAttendees: formValues.maxAttendees || null,
    isActive: true,
    createdAt: new Date(),
    categoryId: formValues.category || "",
    locationId: "",
    isExternal: false,
    sourceType: null,
    sourceId: null,
    externalUrl: null,
    lastSynced: null,
    category: {
      id: formValues.category || "",
      name: categoryName,
    },
    location: {
      id: "preview-location",
      name: formValues.location?.name || "Location",
      formattedAddress: formValues.location?.formattedAddress || "",
      lat: formValues.location?.lat || null,
      lng: formValues.location?.lng || null,
      placeId: formValues.location?.placeId || null,
    },
  };

  return (
    <section className="wrapper">
      <h1>Review Event</h1>

      {/* Display event preview using actual EventCard */}
      <div className="my-6">
        <p className="text-sm text-default-500 mb-4">
          This is how your event will appear to students:
        </p>
        <div className="max-w-[400px]">
          <EventCard event={eventPreview} />
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <div className="flex justify-between mt-5">
          <div className="flex gap-3">
            <Button type="button" variant="bordered" onPress={handleCancel}>
              Cancel
            </Button>
            <Button type="button">
              <HeroUiLink
                href="/admin/events/create/details"
                className="text-default-foreground"
              >
                Previous
              </HeroUiLink>
            </Button>
          </div>
          <Button type="submit" color="primary">
            Create Event
          </Button>
        </div>
      </form>
    </section>
  );
};

const CreateEventFormSubmit: FC = () => {
  return (
    <EventFormWrapper mode="create">
      <SubmitStep />
    </EventFormWrapper>
  );
};

export default CreateEventFormSubmit;
