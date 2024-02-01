import { z } from "zod";

export const newsletterFormSchema = z.object({
  email: z
    .string({ required_error: "Email address is required" })
    .email({ message: "Invalid email address" }),
  first_name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, "100 characters max"),
});

export const EventFormSchema = z.object({
  title: z.string().min(3, "Must be at least 3 characters"),
  description: z
    .string()
    .min(3, "Must be at least 3 letters ")
    .max(1000, "Should not be more than 1000 characters"),
  location: z.string().min(3, "Must be at least 3 characters"),
  imageUrl: z.string(),
  startDateTime: z.date(),
  endDateTime: z.date(),
  categoryId: z.string(),
  price: z.string(),
  isFree: z.boolean(),
});
