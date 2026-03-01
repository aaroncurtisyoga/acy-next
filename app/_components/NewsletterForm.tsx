"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/app/_lib/utils";
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
        <div className="space-y-2">
          <Label htmlFor="newsletter-email">Email</Label>
          <Input
            {...register("email")}
            id="newsletter-email"
            placeholder="Enter your email"
            type="email"
            disabled={isSubmitting}
            className={cn("w-full", errors.email && "border-destructive")}
          />
          {errors.email?.message && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
          <p
            className={cn(
              "text-xs",
              isSubmitSuccessful
                ? "text-green-600 dark:text-green-400"
                : "text-muted-foreground",
            )}
          >
            {isSubmitSuccessful
              ? "Success! Check your email for confirmation."
              : "Be the first to know about events & more!"}
          </p>
        </div>
        <Button type="submit" disabled={isSubmitting} className="font-medium">
          {isSubmitting && <Loader2 className="animate-spin" size={16} />}
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </Button>
      </div>
    </form>
  );
};

export default NewsletterForm;
