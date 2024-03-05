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
    formattedAddress: z.string().min(3, "Address is required"),
    geometry: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    name: z.string().min(3, "Name is required"),
    placeId: z.string().min(3, "Place ID is required"),
  }),
  imageUrl: z.string().min(3, "Image URL required"),
  startDateTime: z.date(),
  endDateTime: z.date(),
  categoryId: z.string().min(3, "Category is required"),
  price: z.string().min(3, "Price is required"),
  isFree: z.boolean(),
});

export const SearchUsersFormSchema = z.object({
  search: z.string(),
});
