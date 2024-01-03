import { z } from "zod";

export const FormNewsletterSchema = z.object({
  email: z
    .string({ required_error: "Email address is required" })
    .email({ message: "Invalid email address" }),
  first_name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1)
    .max(100, "100 characters max"),
});
