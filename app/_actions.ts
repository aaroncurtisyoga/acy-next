"use server";

import mailchimp, { ErrorResponse } from "@mailchimp/mailchimp_marketing";

import { z } from "zod";
import { FormNewsletterSchema } from "@/lib/schema";

type Inputs = z.infer<typeof FormNewsletterSchema>;

export async function addEmailToNewsletter(data: Inputs) {
  console.log("Inside the addEmailToNewsletter fn");
  const result = FormNewsletterSchema.safeParse(data);
  // If server-side form validation successful, then Post to Mailchimp
  if (result.success) {
    // Initialize the Mailchimp client
    mailchimp.setConfig({
      apiKey: process.env.MAILCHIMP_API_KEY,
      server: process.env.MAILCHIMP_API_SERVER,
    });

    try {
      console.log("inside try");
      const addNew = await mailchimp.lists.addListMember(
        String(process.env.MAILCHIMP_AUDIENCE_ID),
        {
          email_address: data.email,
          status: "subscribed",
        },
      );
      console.log("addNew is");
      console.log(addNew);
      return { message: "Successfully subscribed email." };
    } catch (error: any) {
      console.log("Inside catch");
      if (
        error.response?.status === 400 &&
        error.response?.text?.includes("Member Exists")
      ) {
        console.log(error);
        return { error: "ALREADY_SUBSCRIBED", message: "Already subscribed" };
      }

      console.error("Error subscribing email:", error);
      return {
        error: "Failed to subscribe.",
        message: "Something went wrong, please try again later.",
      };
    }
  } else {
    // Todo: Do something if SS Form Validation doesn't work
    console.log("Server: In the Else statement");
  }
}
