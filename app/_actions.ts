"use server";

import { z } from "zod";
import { FormNewsletterSchema } from "@/lib/schema";

type Inputs = z.infer<typeof FormNewsletterSchema>;

export async function addEmailToNewsletter(data: Inputs) {
  const result = FormNewsletterSchema.safeParse(data);
  if (result.success) {
    // todo: do some things here w/ mailchimp
    return {
      success: true,
      data: result.data,
    };
  }
}
