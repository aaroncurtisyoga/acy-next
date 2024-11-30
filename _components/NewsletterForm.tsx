"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { addNewsletterEntry } from "@/_lib/actions/newsletter.actions";
import { newsletterFormSchema } from "@/_lib/schema";

type Inputs = z.infer<typeof newsletterFormSchema>;

const NewsletterForm = () => {
  return (
    <form action="">
      <p>form will go here</p>
    </form>
  );
};

export default NewsletterForm;
