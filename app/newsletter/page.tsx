"use client";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { FormNewsletterSchema } from "@/lib/schema";
import { addNewsletterEntry } from "@/app/actions";
import { useState } from "react";

type Inputs = z.infer<typeof FormNewsletterSchema>;

const NewsletterForm = () => {
  const [successMsg, setSuccessMsg] = useState("");
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm({
    resolver: zodResolver(FormNewsletterSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data: FieldValues) => {
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
      setError("api", {
        type: "server",
        message: result.message,
      });
      return;
    }

    setSuccessMsg(result.message);
    reset();
  };

  return (
    <section className="bg-white shadow-lg p-8 rounded-md gap-2 flex flex-col">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Subscribe to my Newsletter
      </h2>
      <p className="text-gray-90000">
        Be the first to know for upcoming workshops, classes, and more :)
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <label htmlFor={"fname"}>First name</label>
        <input
          {...register("first_name")}
          autoComplete="given-name"
          aria-invalid={errors.first_name ? "true" : "false"}
          className="border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 bg:gray-50 rounded-md py-2 px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="fname"
        />
        {errors.first_name && (
          <p className="text-red-500">{`${errors.first_name.message}`}</p>
        )}
        <label htmlFor="email">Email Address</label>
        <input
          {...register("email")}
          autoComplete="email"
          aria-invalid={errors.email ? "true" : "false"}
          className="border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 bg:gray-50 rounded-md py-2 px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="email"
          // type="email"
        />
        {errors.email && (
          <p className="text-red-500">{`${errors.email.message}`}</p>
        )}
        <button
          className="bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300"
          disabled={isSubmitting}
          type="submit"
        >
          Subscribe
        </button>
        {errors.api && <p role="alert">{`${errors.api.message}`}</p>}
        {successMsg && <p>{successMsg}</p>}
      </form>
    </section>
  );
};

export default NewsletterForm;
