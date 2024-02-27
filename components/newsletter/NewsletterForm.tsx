"use client";

import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/react";

import { addNewsletterEntry } from "@/lib/actions/newsletter.actions";
import { newsletterFormSchema } from "@/lib/schema";
type Inputs = z.infer<typeof newsletterFormSchema>;

const NewsletterForm = () => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
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
    const result = await addNewsletterEntry(data);

    if (result.formErrors) {
      handleErrorsFromServerSideValidation(result.formErrors);
      return;
    }

    if (result.apiError) {
      handleErrorsFromMailchimpApi(result);
      return;
    }

    reset();
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
            description={"Be the first to know about events & more!"}
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
            disabled={isSubmitting}
            {...field}
          />
        )}
      />
    </form>
  );
};

export default NewsletterForm;
