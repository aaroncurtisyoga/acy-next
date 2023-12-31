"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { FormNewsletterSchema } from "@/lib/schema";
import { addEmailToNewsletter } from "@/app/_actions";

type Inputs = z.infer<typeof FormNewsletterSchema>;

const NewsletterForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(FormNewsletterSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const result = await addEmailToNewsletter(data);

    if (!result) {
      console.log("!result");
      console.log(result.error);
      return;
    }

    if (result.error) {
      console.log("result.error");
      console.log(result.error);
      return;
    }

    reset();
    // Todo: Show success message if everything went good
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg p-6 rounded-md gap-2 flex flex-col">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-4">
        Subscribe to my Newsletter
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Be the first to know for upcoming workshops, classes, and more :)
      </p>
      {/* server action would usually use the 'action' attr, but w/ use-react-hook it reqs onSubmit*/}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <label>Email Address</label>
        <input
          aria-invalid={errors.email ? "true" : "false"}
          className="border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 bg:gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 rounded-md py-2 px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
          {...register("email")}
        />
        <button
          type="submit"
          className="bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-800 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300"
        ></button>
        {/*{errors.email?.message && <p role="alert">{errors.email?.message}</p>}*/}
      </form>
    </div>
  );
};

export default NewsletterForm;
