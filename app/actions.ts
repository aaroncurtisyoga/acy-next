"use server";

import { z } from "zod";
import mailchimp from "@mailchimp/mailchimp_marketing";
import { FormNewsletterSchema } from "@/lib/schema";
type Inputs = z.infer<typeof FormNewsletterSchema>;

export async function addNewsletterEntry(data: Inputs) {
  const formValidationResult = FormNewsletterSchema.safeParse(data);

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
          merge_fields: {
            FNAME: data.first_name,
          },
          status: "pending",
        },
      );
      return {
        message: `A confirmation email should be in your inbox soon.`,
      };
    } catch (error: any) {
      if (
        error.response?.status === 400 &&
        error.response?.text?.includes("Member Exists")
      ) {
        return {
          apiError: "ALREADY_SUBSCRIBED",
          message:
            "Looks like you're already subscribed. Keep an eye out for emails from Aaron!",
        };
      }
      return {
        apiError: "Failed to subscribe.",
        message:
          "Sorry. Something went wrong. Email me at aaroncurtisyoga@gmail.com and I'll add you manually!",
      };
    }
  }
}
