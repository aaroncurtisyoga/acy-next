import { z } from "zod";

export const newsletterFormSchema = z.object({
  email: z
    .string({ required_error: "Email address is required" })
    .email({ message: "Please enter a valid email address" }),
});

export const EventFormSchema = z
  .object({
    categoryId: z.string().min(3, "ManageEventCategories is required"),
    description: z
      .string()
      .min(3, "Must be at least 3 letters ")
      .max(2000, "Should not be more than 2000 characters")
      .trim(),
    endDateTime: z.date(),
    imageUrl: z.string().min(3, "Image URL required"),
    isFree: z.boolean(),
    isHostedExternally: z.boolean(),
    location: z.object({
      formattedAddress: z.string().min(3, "Address is required"),
      geometry: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
      name: z.string(),
      placeId: z.string(),
    }),
    price: z.string().min(1, "Price is required"),
    startDateTime: z.date(),
    title: z.string().min(3, "Must be at least 3 characters"),
  })
  .refine((data) => data.startDateTime < data.endDateTime, {
    message: "End date must be after start date",
    path: ["endDateTime"],
  });

export const SearchUsersFormSchema = z.object({
  search: z.string(),
});

export const categoryFormSchema = z.object({
  category: z.string().min(2, "Category required"),
});
