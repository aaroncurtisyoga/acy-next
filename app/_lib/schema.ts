import { z } from "zod";

export const NewsletterFormSchema = z.object({
  email: z
    .string({ message: "Email address is required" })
    .email({ message: "Please enter a valid email address" }),
});

export const EventFormBasicInfoSchema = z.object({
  category: z.string().min(2, "Category is required"),
  endDateTime: z
    .instanceof(Date)
    .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
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
    .instanceof(Date)
    .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
      message: "Invalid date",
    }),
  title: z.string().min(3, "Must be at least 3 characters"),
});

export const CategoryFormSchema = z.object({
  category: z.string().min(2, "Category required"),
});
