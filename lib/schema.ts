import { z } from "zod";

export const newsletterFormSchema = z.object({
  email: z
    .string({ required_error: "Email address is required" })
    .email({ message: "Please enter a valid email address" }),
});

const commonFields = () => ({
  categoryId: z.string().min(3, "ManageEventCategories is required"),
  endDateTime: z.date(),
  location: z.object({
    formattedAddress: z.string().min(3, "Address is required"),
    geometry: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    name: z.string(),
    placeId: z.string(),
  }),
  startDateTime: z.date(),
  title: z.string().min(3, "Must be at least 3 characters"),
});

export const EventFormSchemaForExternalRegistration = z.object({
  ...commonFields(),
  externalRegistrationUrl: z.string().url(),
  isHostedExternally: z.literal(true),
});

export const EventFormSchemaForInternalRegistration = z.object({
  ...commonFields(),
  description: z
    .string()
    .min(3, "Must be at least 3 letters ")
    .max(2000, "Should not be more than 2000 characters")
    .trim(),
  isFree: z.boolean(),
  isHostedExternally: z.literal(false),
  imageUrl: z.string().min(3, "ImageUrl is required"),
  maxAttendees: z.number().min(1, "Max attendees is required"),
  price: z.string().min(1, "Price is required"),
});

export const SearchUsersFormSchema = z.object({
  search: z.string(),
});

export const categoryFormSchema = z.object({
  category: z.string().min(2, "Category required"),
});
