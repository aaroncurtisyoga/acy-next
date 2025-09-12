"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button } from "@heroui/react";
import { addNewsletterEntry } from "@/app/_lib/actions/newsletter.actions";
import { NewsletterFormSchema } from "@/app/_lib/schema";
import { z } from "zod";

type FormData = z.infer<typeof NewsletterFormSchema>;

const NewsletterForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormData>({
    resolver: zodResolver(NewsletterFormSchema),
  });

  const onSubmit = async (data: FormData) => {
    clearErrors();
    const result = await addNewsletterEntry(data);

    if (result.formErrors || result.apiError) {
      setError("email", {
        type: "manual",
        message: result.message || "Something went wrong",
      });
      return;
    }

    reset();
    setTimeout(() => {
      clearErrors();
    }, 3000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex flex-col gap-4">
        <Input
          {...register("email")}
          label="Email"
          placeholder="Enter your email"
          type="email"
          variant="bordered"
          description={
            <span className="block w-full">
              {isSubmitSuccessful
                ? "Success! Check your email for confirmation."
                : "Be the first to know about events & more!"}
            </span>
          }
          color={isSubmitSuccessful ? "success" : "default"}
          isDisabled={isSubmitting}
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
          isClearable
          onClear={() => clearErrors("email")}
          className="w-full"
        />
        <Button
          type="submit"
          color="primary"
          variant="solid"
          size="md"
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
          className="font-medium"
        >
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </Button>
      </div>
    </form>
  );
};

export default NewsletterForm;
