"use client";

import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { addNewsletterEntry } from "@/lib/actions/newsletter.actions";
import { newsletterFormSchema } from "@/lib/schema";
type Inputs = z.infer<typeof newsletterFormSchema>;

const NewsletterForm = () => {
  const [newsletterEntryAdded, setNewsletterEntryAdded] = useState(false);
  const form = useForm<z.infer<typeof newsletterFormSchema>>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: {
      first_name: "",
      email: "",
    },
  });

  const handleFormErrors = (
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

  const handleApiErrors = (result: { apiError?: string; message?: string }) => {
    form.setError("root", {
      type: "server",
      message: result.message,
    });
  };

  const onSubmit: SubmitHandler<Inputs> = async (data: FieldValues) => {
    setNewsletterEntryAdded(false);
    const result = await addNewsletterEntry(data);

    if (result.formErrors) {
      handleFormErrors(result.formErrors);
      return;
    }

    if (result.apiError) {
      handleApiErrors(result);
      return;
    }

    setNewsletterEntryAdded(true);
    form.reset();
  };

  return (
    <p>newsletter form</p>
    /* <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name={"first_name"}
          render={({ field }) => (
            <FormItem>
              {/!*<FormLabel>First Name</FormLabel>*!/}
              <FormControl>
                <Input {...field} placeholder={"First Name"} />
              </FormControl>
              <FormMessage className={"pl-3"} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"email"}
          render={({ field }) => (
            <FormItem className={"mt-3"}>
              {/!*<FormLabel>Email</FormLabel>*!/}
              <FormControl>
                <Input {...field} type="email" placeholder={"Email Address"} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <button type={"submit"} disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <p>Loading...</p> : "Subscribe"}
        </button>
        {form.formState.errors?.root && (
          <>
            <p>an error occurred</p>
            <p>{form.formState.errors.root.message}</p>
          </>
        )}
        {newsletterEntryAdded && (
          <>
            <p>All Set!</p>
            <p>A confirmation email should be in your inbox soon.</p>
          </>
        )}
      </form>
    </Form>*/
  );
};

export default NewsletterForm;
