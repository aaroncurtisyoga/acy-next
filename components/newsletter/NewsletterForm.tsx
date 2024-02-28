"use client";

import { useEffect, useState } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Spinner } from "@nextui-org/react";
import { ArrowRight, Check } from "lucide-react";
import { addNewsletterEntry } from "@/lib/actions/newsletter.actions";
import { newsletterFormSchema } from "@/lib/schema";

type Inputs = z.infer<typeof newsletterFormSchema>;

const NewsletterForm = () => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<Inputs>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: {
      email: "",
    },
  });
  const [resetFormOnNextInput, setResetFormOnNextInput] = useState(false);

  useEffect(() => {
    // Flag form to reset on next input. Done this way so success message
    // can persist until the user starts typing again.
    if (isSubmitSuccessful) {
      setResetFormOnNextInput(true);
    }
  }, [reset, isSubmitSuccessful]);

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

  const determineFormIcon = (
    isSubmitting: boolean,
    isSubmitSuccessful: boolean,
  ) => {
    if (isSubmitting) {
      return <Spinner size={"sm"} />;
    }
    if (isSubmitSuccessful) {
      return <Check className={"text-success"} />;
    }
    return <ArrowRight className={"text-default-900"} />;
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
              mainWrapper: "w-unit-64",
            }}
            description={`${
              isSubmitSuccessful
                ? "Thank you for signing up!"
                : "Be the first to know about events & more!"
            }`}
            type={"email"}
            label={"Newsletter:"}
            labelPlacement="outside"
            variant="underlined"
            name={"email"}
            placeholder={"Email"}
            value={field.value}
            onBeforeInput={() => {
              if (resetFormOnNextInput) {
                reset({
                  email: "",
                });
                setResetFormOnNextInput(false);
              }
            }}
            onChange={(e) => {
              field.onChange(e);
            }}
            disabled={isSubmitting}
            errorMessage={
              (errors.email && errors.email.message) ||
              (errors.root && errors.root.message)
            }
            endContent={
              <button
                className="focus:outline-none"
                type="submit"
                disabled={isSubmitting}
              >
                {determineFormIcon(isSubmitting, isSubmitSuccessful)}
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
