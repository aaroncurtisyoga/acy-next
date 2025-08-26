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
      // Show validation errors
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
      // Show API errors
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("email")}
        type="email"
        label="Email"
        placeholder="Enter your email"
        description={
          isSuccess
            ? "Thank you for signing up!"
            : "Be the first to know about events & more!"
        }
        variant="flat"
        isDisabled={isSubmitting || isSuccess}
        isInvalid={!!errors.email || !!errors.root}
        errorMessage={errors.email?.message || errors.root?.message}
        endContent={
          <button type="submit" disabled={isSubmitting || isSuccess}>
            {isSubmitting ? (
              <Spinner size="sm" />
            ) : isSuccess ? (
              <Check size={20} />
            ) : (
              <ArrowRight size={20} />
            )}
          </button>
        }
      />
    </form>
  );
};

export default NewsletterForm;
