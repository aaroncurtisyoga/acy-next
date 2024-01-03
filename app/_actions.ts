"use server";

/*
 * Todo:
 *   Handle showing specific form errors, https://www.youtube.com/watch?v=tLhcyBfljYo
 *   Handle Server mailchimp errors (display below the form?)
 *   Handle server success (display below the form?) + clear the form
 * */
import mailchimp, { ErrorResponse } from "@mailchimp/mailchimp_marketing";
import { z } from "zod";
import { FormNewsletterSchema } from "@/lib/schema";
type Inputs = z.infer<typeof FormNewsletterSchema>;

export async function addEmailToNewsletter(data: Inputs) {
  const result = FormNewsletterSchema.safeParse(data);

  let zodErrors = {};
  if (result.success === false) {
    // Return form validation error(s)
    result.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
    });
    return { errors: zodErrors };
  } else {
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
  }
}
