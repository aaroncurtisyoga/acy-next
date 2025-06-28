"use client";

import { useState } from "react";
import { Spinner, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { addNewsletterEntry } from "@/app/_lib/actions/newsletter.actions";
import { NewsletterFormSchema } from "@/app/_lib/schema";

type Inputs = z.infer<typeof NewsletterFormSchema>;

const NewsletterForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(NewsletterFormSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const result = await addNewsletterEntry(data);

    if (result.formErrors) {
      // Handle validation errors
      for (const [field, error] of Object.entries(result.formErrors)) {
        if (field !== "_errors" && error && "_errors" in error) {
          setError(field as keyof Inputs, {
            type: "server",
            message: error._errors?.join(", "),
          });
        }
      }
      return;
    }

    if (result.apiError) {
      // Handle API errors
      setError("root", {
        type: "server",
        message: result.message,
      });
      return;
    }

    // Success - show success state and reset after delay
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      reset();
    }, 3000);
  };

  const getIcon = () => {
    if (isSubmitting) return <Spinner size="sm" />;
    if (isSuccess) return <Check className="text-success" />;
    return <ArrowRight className="text-default-900" />;
  };

  const getDescription = () => {
    if (isSuccess) return "Thank you for signing up!";
    return "Be the first to know about events & more!";
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("email")}
        classNames={{
          description: "text-default-900",
          label: "font-medium",
          mainWrapper: "w-64",
        }}
        description={getDescription()}
        type="email"
        label="Newsletter:"
        labelPlacement="outside"
        variant="underlined"
        placeholder="Email"
        isDisabled={isSubmitting || isSuccess}
        errorMessage={errors.email?.message || errors.root?.message}
        endContent={
          <button
            className="focus:outline-none"
            type="submit"
            disabled={isSubmitting || isSuccess}
            aria-label={
              isSubmitting
                ? "Submitting"
                : isSuccess
                  ? "Submission successful"
                  : "Submit newsletter form"
            }
          >
            {getIcon()}
          </button>
        }
      />
    </form>
  );
};

export default NewsletterForm;
