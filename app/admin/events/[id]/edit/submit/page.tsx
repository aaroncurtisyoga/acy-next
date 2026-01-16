"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Link as HeroUiLink } from "@heroui/link";
import { useFormContext } from "react-hook-form";
import { updateEvent, getEventById } from "@/app/_lib/actions/event.actions";
import { getAllCategories } from "@/app/_lib/actions/category.actions";
import { handleError } from "@/app/_lib/utils";
import {
  EventFormValues,
  useEventFormContext,
} from "@/app/admin/events/_components/EventForm/EventFormProvider";
import {
  parseZonedDateTime,
  fromDate,
  getLocalTimeZone,
} from "@internationalized/date";
import EventFormWrapper from "@/app/admin/events/_components/EventForm/EventFormWrapper";
import EventCard from "@/app/(root)/_components/EventCard";
import { EventWithLocationAndCategory } from "@/app/_lib/types";

const SubmitStep = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
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

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = getValues();
    setSubmitError("");
    setIsSubmitting(true);

    try {
      // Convert ZonedDateTime objects to UTC ISO strings for proper database storage
      const startDateTime = values.startDateTime?.toAbsoluteString
        ? values.startDateTime.toAbsoluteString()
        : values.startDateTime;
      const endDateTime = values.endDateTime?.toAbsoluteString
        ? values.endDateTime.toAbsoluteString()
        : values.endDateTime;

      const eventData = {
        ...values,
        id,
        startDateTime,
        endDateTime,
        isFree: values.isFree ?? false,
      };

      const updated = await updateEvent({
        event: eventData,
        path: `/events/${id}`,
      });

      if (updated) {
        clearFormData();
        reset();
        router.push(`/events/${id}`);
      } else {
        setSubmitError("Failed to update event - no response from server");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      setSubmitError(
        `Error updating event: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    clearFormData();
    reset();
    router.push("/admin/events");
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
                href={`/admin/events/${id}/edit/details`}
                className="text-default-foreground"
              >
                Previous
              </HeroUiLink>
            </Button>
          </div>
          <Button type="submit" color="primary" isLoading={isSubmitting}>
            {isSubmitting ? "Updating Event..." : "Update Event"}
          </Button>
        </div>
      </form>
    </section>
  );
};

const EditSubmitPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [defaultValues, setDefaultValues] = useState<EventFormValues | null>(
    null,
  );

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const event = await getEventById(id);
        // Transform database event to form values
        const { attendees, ...eventWithoutAttendees } = event;
        const formValues: EventFormValues = {
          ...eventWithoutAttendees,
          category:
            typeof event.category === "object"
              ? event.category.id
              : event.category,
          location: event.location
            ? {
                formattedAddress: event.location.formattedAddress,
                lat: event.location.lat,
                lng: event.location.lng,
                name: event.location.name,
                placeId: event.location.placeId,
              }
            : undefined,
          // Convert dates to ZonedDateTime objects
          // Handle both ZonedDateTime strings (with [timezone]) and ISO strings
          startDateTime: event.startDateTime
            ? typeof event.startDateTime === "string"
              ? event.startDateTime.includes("[")
                ? parseZonedDateTime(event.startDateTime)
                : fromDate(new Date(event.startDateTime), getLocalTimeZone())
              : fromDate(new Date(event.startDateTime), getLocalTimeZone())
            : undefined,
          endDateTime: event.endDateTime
            ? typeof event.endDateTime === "string"
              ? event.endDateTime.includes("[")
                ? parseZonedDateTime(event.endDateTime)
                : fromDate(new Date(event.endDateTime), getLocalTimeZone())
              : fromDate(new Date(event.endDateTime), getLocalTimeZone())
            : undefined,
        };
        setDefaultValues(formValues);
      } catch (err) {
        handleError(err);
        router.push("/");
      }
    };

    loadEvent();
  }, [id, router]);

  if (!defaultValues) return null;

  return (
    <EventFormWrapper mode="edit" defaultValues={defaultValues}>
      <SubmitStep />
    </EventFormWrapper>
  );
};

export default EditSubmitPage;
