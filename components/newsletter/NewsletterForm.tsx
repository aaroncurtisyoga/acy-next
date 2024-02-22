"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { addNewsletterEntry } from "@/lib/actions/newsletter.actions";
import { newsletterFormSchema } from "@/lib/schema";
type Inputs = z.infer<typeof newsletterFormSchema>;

const NewsletterForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: {
      first_name: "",
      email: "",
    },
  });

  const handleErrorsFromServerSideValidation = (
    formErrors: z.ZodFormattedError<typeof newsletterFormSchema>,
  ) => {
    for (const formInput in formErrors) {
      // @ts-ignore
      form.setError(formInput, {
        type: "server",
        message:
          formErrors[formInput]._errors?.join(", ") ||
          formErrors._errors?.join(", "),
      });
    }
  };

  const handleErrorsFromMailchimpApi = (result: {
    apiError?: string;
    message?: string;
  }) => {
    setError("root", {
      type: "server",
      message: result.message,
    });
  };
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log("NewsletterForm onSubmit: triggered");
    const result = await addNewsletterEntry(data);

    if (result.formErrors) {
      handleErrorsFromServerSideValidation(result.formErrors);
      return;
    }

    if (result.apiError) {
      handleErrorsFromMailchimpApi(result);
      return;
    }

    console.log("NewsletterForm onSubmit: end of fn");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input defaultValue="First name" {...register("first_name")} />
      <input defaultValue="Email address" {...register("email")} />
      <input type="submit" disabled={isSubmitting} />
    </form>
  );
};

export default NewsletterForm;
