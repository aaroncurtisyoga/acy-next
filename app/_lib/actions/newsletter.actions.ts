"use server";

import mailchimp from "@mailchimp/mailchimp_marketing";
import { z } from "zod";
import { NewsletterFormSchema } from "@/app/_lib/schema";
type Inputs = z.infer<typeof NewsletterFormSchema>;

export async function addNewsletterEntry(data: Inputs) {
  // Validate form
  const formValidationResult = NewsletterFormSchema.safeParse(data);

  if (formValidationResult.success === false) {
    return { formErrors: formValidationResult.error.format() };
  } else {
    // Log environment variables (without exposing sensitive data)
    console.log("Mailchimp Config:", {
      hasApiKey: !!process.env.MAILCHIMP_API_KEY,
      server: process.env.MAILCHIMP_API_SERVER,
      audienceId: process.env.MAILCHIMP_AUDIENCE_ID,
      email: data.email,
    });

    // Init Mailchimp client
    mailchimp.setConfig({
      apiKey: process.env.MAILCHIMP_API_KEY,
      server: process.env.MAILCHIMP_API_SERVER,
    });

    try {
      const result = await mailchimp.lists.setListMember(
        String(process.env.MAILCHIMP_AUDIENCE_ID),
        data.email,
        {
          email_address: data.email,
          status_if_new: "subscribed",
        },
      );
      console.log("Newsletter subscription successful:", {
        email: data.email,
        result,
      });
      return {
        message: `A confirmation email should be in your inbox soon.`,
      };
    } catch (error: any) {
      console.error("Newsletter subscription error:", {
        message: error.message,
        status: error.status,
        response: error.response,
        responseText: error.response?.text,
        responseStatus: error.response?.status,
        email: data.email,
        fullError: error,
      });

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
