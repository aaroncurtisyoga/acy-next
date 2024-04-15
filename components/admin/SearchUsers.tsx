"use client";

import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { SearchUsersFormSchema } from "@/lib/schema";

const SearchUsers: FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof SearchUsersFormSchema>>({
    resolver: zodResolver(SearchUsersFormSchema),
    defaultValues: { search: "" },
  });
  const onSubmit = async (data: z.infer<typeof SearchUsersFormSchema>) => {
    router.push(`${pathname}?search=${data.search}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name={"search"}
        render={({ field }) => (
          <Input
            disabled={isSubmitting}
            errorMessage={errors.search?.message}
            label={"Search"}
            onChange={(e) => field.onChange(e)}
            variant="bordered"
            {...field}
          />
        )}
      />
      <Button type="submit" color={"secondary"}>
        Submit
      </Button>
    </form>
  );
};

export default SearchUsers;
