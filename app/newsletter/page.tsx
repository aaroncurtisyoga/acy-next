"use client";

import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { FormNewsletterSchema } from "@/lib/schema";
import { addNewsletterEntry } from "@/app/actions";
import { Button } from "@/components/ui/button";

type Inputs = z.infer<typeof FormNewsletterSchema>;

const NewsletterForm = () => {
  // const [newsletterEntryAdded, setNewsletterEntryAdded] = useState(false);
  const form = useForm<z.infer<typeof FormNewsletterSchema>>({
    resolver: zodResolver(FormNewsletterSchema),
    defaultValues: {
      first_name: "",
      email: "",
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data: FieldValues) => {
    console.log(data);
    /*  setNewsletterEntryAdded(false);
    const result = await addNewsletterEntry(data);

    if (result.formErrors) {
      // handle server side form validation errors
      const formErrors = result.formErrors;
      for (const formInput in formErrors) {
        setError(formInput, {
          type: "server",
          message:
            formErrors[formInput]._errors?.join(", ") ||
            formErrors._errors?.join(", "),
        });
      }
      return;
    } else if (result.apiError) {
      // handle errors from mailchimp api
      form.setError("api", {
        type: "server",
        message: result.message,
      });
      return;
    }

    setNewsletterEntryAdded(true);
    form.reset();*/
  };

  return (
    <section className="bg-white shadow-lg rounded-md gap-2 flex flex-col p-6 md:p-8">
      <h1 className="text-3xl mb-8">Subscribe to my Newsletter</h1>
      <p className="mb-6">
        Be the first to know about my upcoming workshops, events, and
        long-format classes!
      </p>
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
              <FormItem>
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
    </section>
  );
};

export default NewsletterForm;
