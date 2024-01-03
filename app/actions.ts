"use server";

/*
 * Todo:
 *   Handle showing specific form errors, https://www.youtube.com/watch?v=tLhcyBfljYo
 *   Is there a better way to handle the multiple input server side validation than several if statements?
 *   Handle Server mailchimp errors (display below the form?)
 *   Handle server success (display below the form?) + clear the form
 * */
// import mailchimp, { ErrorResponse } from "@mailchimp/mailchimp_marketing";
import { z } from "zod";
import { FormNewsletterSchema } from "@/lib/schema";
type Inputs = z.infer<typeof FormNewsletterSchema>;
export async function serverValidationNewsletterEntry(data: Inputs) {
  const formValidationResult = FormNewsletterSchema.safeParse(data);

  if (formValidationResult.success === false) {
    return { errors: formValidationResult.error.format() };
  }
}

/*async function addNewsletterEntryToMailchimp(data: Inputs) {
  // Initialize the Mailchimp client
  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_API_SERVER,
  });

  try {
    const addNew = await mailchimp.lists.addListMember(
      String(process.env.MAILCHIMP_AUDIENCE_ID),
      {
        email_address: data.email,
        merge_fields: {
          FNAME: data.first_name,
        },
        status: "subscribed",
      },
    );
    return { message: "Successfully subscribed email." };
  } catch (error: any) {
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
}*/
