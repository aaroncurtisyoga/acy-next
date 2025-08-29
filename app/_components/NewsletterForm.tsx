"use client";

import React, { useState } from "react";
import { Input, Button } from "@heroui/react";
import { addNewsletterEntry } from "@/app/_lib/actions/newsletter.actions";

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await addNewsletterEntry({ email });

    if (result.formErrors || result.apiError) {
      setError(result.message || "Something went wrong");
      setIsSubmitting(false);
      return;
    }

    setIsSuccess(true);
    setEmail("");
    setIsSubmitting(false);

    setTimeout(() => {
      setIsSuccess(false);
    }, 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <div className="flex flex-col gap-4">
        <Input
          label="Email"
          placeholder="Enter your email"
          type="email"
          value={email}
          onValueChange={setEmail}
          description={
            isSuccess
              ? "Thank you for signing up!"
              : "Be the first to know about events & more!"
          }
          color={isSuccess ? "success" : "default"}
          isDisabled={isSubmitting}
          isInvalid={!!error}
          errorMessage={error}
          isClearable
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
