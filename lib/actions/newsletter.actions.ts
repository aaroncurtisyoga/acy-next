"use server";

import { z } from "zod";
import mailchimp from "@mailchimp/mailchimp_marketing";
import { newsletterFormSchema } from "@/lib/schema";
type Inputs = z.infer<typeof newsletterFormSchema>;

export async function addNewsletterEntry(data: Inputs) {
  // Validate form data
  const formValidationResult = newsletterFormSchema.safeParse(data);

  if (formValidationResult.success === false) {
    return { formErrors: formValidationResult.error.format() };
  } else {
    // Init Mailchimp client
    mailchimp.setConfig({
      apiKey: process.env.MAILCHIMP_API_KEY,
      server: process.env.MAILCHIMP_API_SERVER,
    });

    try {
      const response = await mailchimp.lists.addListMember(
        String(process.env.MAILCHIMP_AUDIENCE_ID),
        {
          email_address: data.email,
          status: "pending",
        },
      );
      return {
        message: `A confirmation email should be in your inbox soon.`,
      };
    } catch (error) {
      if (
        error.response?.status === 400 &&
        error.response?.text?.includes("Member Exists")
      ) {
        return {
          apiError: "ALREADY_SUBSCRIBED",
          message: "Looks like you're already subscribed.",
        };
      }
      return {
        apiError: "Failed to subscribe.",
        message: "Sorry. Something went wrong. Please try again later!",
      };
    }
  }
}
