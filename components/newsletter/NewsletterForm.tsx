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

import { addNewsletterEntry } from "@/lib/actions/newsletter.actions";
import { newsletterFormSchema } from "@/lib/schema";
import { AlertWrapper } from "@/components/shared/AlertWrapper";
import { AlertTriangle, Mail, Loader } from "lucide-react";
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name={"first_name"}
          render={({ field }) => (
            <FormItem>
              {/*<FormLabel>First Name</FormLabel>*/}
              <FormControl>
                <Input
                  {...field}
                  className={"input-field pb-6"}
                  placeholder={"First Name"}
                />
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
              {/*<FormLabel>Email</FormLabel>*/}
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  className={"input-field"}
                  placeholder={"Email Address"}
                />
              </FormControl>
              <FormMessage className={"pl-3"} />
            </FormItem>
          )}
        />

        <Button
          variant={"default"}
          type={"submit"}
          className={"my-8 w-full"}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Loader className={"animate-spin"} />
          ) : (
            "Subscribe"
          )}
        </Button>
        {form.formState.errors?.root && (
          <AlertWrapper
            title={"An error occurred"}
            description={form.formState.errors.root.message}
            variant={"destructive"}
          >
            <AlertTriangle />
          </AlertWrapper>
        )}
        {newsletterEntryAdded && (
          <AlertWrapper
            title={"All set!"}
            description={"A confirmation email should be in your inbox soon."}
            variant={"success"}
          >
            <Mail />
          </AlertWrapper>
        )}
      </form>
    </Form>
  );
};

export default NewsletterForm;
