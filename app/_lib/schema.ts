import { ZonedDateTime } from "@internationalized/date";
import { z } from "zod";

export const NewsletterFormSchema = z.object({
  email: z
    .string({ required_error: "Email address is required" })
    .email({ message: "Please enter a valid email address" }),
});

export const EventFormBasicInfoSchema = z.object({
  category: z.string().min(2, "Category is required"),
  endDateTime: z
    .instanceof(ZonedDateTime)
    .refine((val) => val instanceof ZonedDateTime, {
      message: "Invalid date",
    }),
  isHostedExternally: z.boolean(),
  location: z.object({
    formattedAddress: z.string().min(3, "Address is required"),
    lat: z.number(),
    lng: z.number(),
    name: z.string(),
    placeId: z.string(),
  }),
  startDateTime: z
    .instanceof(ZonedDateTime)
    .refine((val) => val instanceof ZonedDateTime, {
      message: "Invalid date",
    }),
  title: z.string().min(3, "Must be at least 3 characters"),
});

export const EventFormDetailsSchema = z.object({
  categoryId: z.string().min(3, "CreateCategory is required"),
  price: z.string().min(1, "Price is required"),
  imageUrl: z.string().min(3, "ImageUrl is required"),
  description: z
    .string()
    .min(3, "Must be at least 3 letters ")
    .max(2000, "Should not be more than 2000 characters")
    .trim(),
  isFree: z.boolean(),
});

export const EventFormDetailsForExternallyHostedEventSchema = z.object({
  externalRegistrationUrl: z.string().url(),
});

export const EventFormDetailsForInternallyHostedEventSchema = z.object({
  description: z.string().min(3, "Description is required"),
  imageUrl: z.string().min(3, "ImageUrl is required"),
  price: z.string().min(1, "Price is required"),
  maxAttendees: z.number().min(1, "Max attendees is required"),
});

export const CategoryFormSchema = z.object({
  category: z.string().min(2, "Category required"),
});

export const SelectPackageFormSchema = z.object({
  sessionCount: z
    .number()
    .min(1, "Please select at least 1 session")
    .max(20, "Maximum 20 sessions allowed"),
});
