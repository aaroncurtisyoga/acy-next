"use client";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { addNewsletterEntry } from "@/app/actions";
import { FormNewsletterSchema } from "@/lib/schema";
type Inputs = z.infer<typeof FormNewsletterSchema>;

const NewsletterForm = () => {
  const [newsletterEntryAdded, setNewsletterEntryAdded] = useState(false);
  const form = useForm<z.infer<typeof FormNewsletterSchema>>({
    resolver: zodResolver(FormNewsletterSchema),
    defaultValues: {
      first_name: "",
      email: "",
    },
  });

  const handleFormErrors = (
    formErrors: z.ZodFormattedError<typeof FormNewsletterSchema>,
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name={"first_name"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"email"}
          render={({ field }) => (
            <FormItem className={"mt-3"}>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant={"outline"} type={"submit"} className={"mt-8 w-full"}>
          Subscribe
        </Button>
      </form>
    </Form>
  );
};

export default NewsletterForm;
