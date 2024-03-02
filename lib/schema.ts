import { z } from "zod";

export const newsletterFormSchema = z.object({
  email: z
    .string({ required_error: "Email address is required" })
    .email({ message: "Please enter a valid email address" }),
});

export const EventFormSchema = z.object({
  title: z.string().min(3, "Must be at least 3 characters"),
  description: z
    .string()
    .min(3, "Must be at least 3 letters ")
    .max(2000, "Should not be more than 2000 characters"),
  location: z.object({
    formattedAddress: z.string(),
    geometry: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    name: z.string(),
    placeId: z.string(),
  }),
  imageUrl: z.string(),
  startDateTime: z.date(),
  endDateTime: z.date(),
  categoryId: z.string(),
  price: z.string(),
  isFree: z.boolean(),
});

export const SearchUsersFormSchema = z.object({
  search: z.string(),
});
