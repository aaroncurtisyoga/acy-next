"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/react";
import { ArrowRight } from "lucide-react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { addNewsletterEntry } from "@/_lib/actions/newsletter.actions";
import { newsletterFormSchema } from "@/_lib/schema";

type Inputs = z.infer<typeof newsletterFormSchema>;

/*
 * Todo:
 *  1. Add a success message that replaces the Form and just says something
 *  like "Success! Please, check your email to confirm your subscription."
 *  2. Add a loading spinner to the button when the form is submitting? but
 *  do it in a way that doesnt cause another hydration err
 * */

const NewsletterForm = () => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<Inputs>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleErrorsFromServerSideValidation = (
    formErrors: z.ZodFormattedError<typeof newsletterFormSchema>,
  ) => {
    for (const formInput in formErrors) {
      // @ts-ignore
      setError(formInput, {
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
    const result = await addNewsletterEntry(data);
    if (result.formErrors) {
      handleErrorsFromServerSideValidation(result.formErrors);
      return;
    }

    if (result.apiError) {
      handleErrorsFromMailchimpApi(result);
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name={"email"}
        control={control}
        rules={{
          required: true,
        }}
        render={({ field }) => (
          <Input
            classNames={{
              description: "text-default-900",
              label: "font-medium",
              mainWrapper: "w-64",
            }}
            description={"Subscribe to know about my events & more"}
            type={"email"}
            label={"Newsletter:"}
            labelPlacement="outside"
            variant="underlined"
            name={"email"}
            placeholder={"Email"}
            value={field.value}
            onChange={(e) => {
              field.onChange(e);
            }}
            isDisabled={isSubmitting}
            // errorMessage={
            //   (errors.email && errors.email.message) ||
            //   (errors.root && errors.root.message)
            // }
            endContent={
              <button
                className="focus:outline-none"
                type="submit"
                disabled={isSubmitting}
                aria-label="Submit newsletter form"
              >
                <ArrowRight className={"text-default-900"} />
              </button>
            }
            {...field}
          />
        )}
      />
    </form>
  );
};

export default NewsletterForm;
