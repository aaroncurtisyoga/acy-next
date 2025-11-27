"use client";

import { FC, FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Link as HeroUiLink } from "@heroui/link";
import { useFormContext } from "react-hook-form";
import { createEvent } from "@/app/_lib/actions/event.actions";
import { CreateEventData } from "@/app/_lib/types/event";
import {
  EventFormValues,
  useEventFormContext,
} from "@/app/admin/events/_components/EventForm/EventFormProvider";
import EventFormWrapper from "@/app/admin/events/_components/EventForm/EventFormWrapper";
import EventCard from "@/app/(root)/_components/EventCard";
import { EventWithLocationAndCategory } from "@/app/_lib/types";
import { getAllCategories } from "@/app/_lib/actions/category.actions";

const SubmitStep: FC = () => {
  const router = useRouter();
  const { getValues, reset } = useFormContext<EventFormValues>();
  const { clearFormData } = useEventFormContext();
  const [categoryName, setCategoryName] = useState<string>("Loading...");
  const [submitError, setSubmitError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          } else {
            setCategoryName("Unknown Category");
          }
        } catch (error) {
          console.error("Failed to fetch category:", error);
          setCategoryName("Error loading category");
        }
      } else {
        setCategoryName("No category selected");
      }
    };
    fetchCategoryName();
  }, [getValues]);

  async function createNewEvent() {
    const formValues = getValues();
    setSubmitError("");
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formValues.location || !formValues.location.placeId) {
        setSubmitError("Please select a valid location from the dropdown");
        setIsSubmitting(false);
        return;
      }

      if (!formValues.title) {
        setSubmitError("Please enter a title");
        setIsSubmitting(false);
        return;
      }

      if (!formValues.category) {
        setSubmitError("Please select a category");
        setIsSubmitting(false);
        return;
      }

      console.log("Form values:", formValues);
      console.log("Location details:", formValues.location);
      console.log("Location placeId:", formValues.location?.placeId);

      // Convert ZonedDateTime objects to ISO strings for serialization
      const eventData: CreateEventData = {
        title: formValues.title,
        startDateTime: formValues.startDateTime?.toString
          ? formValues.startDateTime.toString()
          : formValues.startDateTime,
        endDateTime: formValues.endDateTime?.toString
          ? formValues.endDateTime.toString()
          : formValues.endDateTime,
        price: formValues.price || "0",
        isFree: formValues.isFree ?? false,
        category: formValues.category,
        location: {
          name: formValues.location.name,
          formattedAddress: formValues.location.formattedAddress,
          placeId: formValues.location.placeId,
          lat: formValues.location.lat,
          lng: formValues.location.lng,
        },
        description: formValues.description || "",
        maxAttendees: formValues.maxAttendees || undefined,
        imageUrl: formValues.imageUrl || "",
        isHostedExternally: formValues.isHostedExternally || false,
        externalRegistrationUrl:
          formValues.externalRegistrationUrl || undefined,
      };

      console.log("Event data being sent:", eventData);

      const newEvent = await createEvent({
        event: eventData,
        path: "/events",
      });

      console.log("Create event response:", newEvent);

      if (newEvent) {
        clearFormData(); // Clear stored form data
        reset(); // Clear form state
        router.push(`/admin/events`);
      } else {
        setSubmitError("Failed to create event - no response from server");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      setSubmitError(
        `Error creating event: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createNewEvent();
  };

  const handleCancel = () => {
    clearFormData(); // Clear stored form data
    reset(); // Clear form state
    router.push("/admin/events"); // Go back to events list
  };

  const formValues = getValues();

  // Transform form values to match EventCard expected format
  const eventPreview: EventWithLocationAndCategory = {
    id: "preview",
    title: formValues.title || "",
    description: formValues.description || "",
    imageUrl: formValues.imageUrl || "/assets/images/handstand_desktop.jpeg",
    startDateTime: formValues.startDateTime
      ? formValues.startDateTime.toDate("America/New_York")
      : new Date(),
    endDateTime: formValues.endDateTime
      ? formValues.endDateTime.toDate("America/New_York")
      : new Date(),
    price: formValues.price || "0",
    isFree: formValues.isFree === true,
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
    googleEventId: null,
    googleEventLink: null,
    category: {
      id: formValues.category || "",
      name: categoryName,
    },
    location: {
      id: "preview-location",
      name:
        formValues.location?.name ||
        (formValues.location?.formattedAddress
          ? formValues.location.formattedAddress.split(",")[0]
          : "No location selected"),
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
        <div className="max-w-full">
          <EventCard event={eventPreview} />
        </div>
      </div>

      <form onSubmit={onSubmit}>
        {submitError && (
          <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg">
            <p className="text-danger-600 text-sm font-medium">{submitError}</p>
          </div>
        )}

        <div className="flex justify-between mt-5">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="bordered"
              onPress={handleCancel}
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="button" isDisabled={isSubmitting}>
              <HeroUiLink
                href="/admin/events/create/details"
                className="text-default-foreground"
              >
                Previous
              </HeroUiLink>
            </Button>
          </div>
          <Button type="submit" color="primary" isLoading={isSubmitting}>
            {isSubmitting ? "Creating Event..." : "Create Event"}
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
