import mailchimp, { ErrorResponse } from "@mailchimp/mailchimp_marketing";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "METHOD_NOT_ALLOWED", message: "Method not allowed" });
  }

  const { email } = req.body;

  // Initialize the Mailchimp client

  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_API_SERVER,
  });

  try {
    const addNew = await mailchimp.lists.addListMember(
      String(process.env.MAILCHIMP_AUDIENCE_ID),
      {
        email_address: email,
        status: "subscribed",
      },
    );

    return res.status(200).json({ message: "Successfully subscribed email." });
  } catch (error: any) {
    if (
      error.response?.status === 400 &&
      error.response?.text?.includes("Member Exists")
    ) {
      return res
        .status(400)
        .json({ error: "ALREADY_SUBSCRIBED", message: "Already subscribed" });
    }

    console.error("Error subscribing email:", error);
    return res.status(500).json({
      error: "Failed to subscribe.",
      message: "Something went wrong, please try again later.",
    });
  }
}
