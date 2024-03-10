import React from "react";
import { Controller } from "react-hook-form";
import Tiptap from "@/components/shared/Tiptap";

const Description = ({ control, isSubmitting, errors }) => {
  return (
    /*<Controller
      control={control}
      name="description"
      render={({ field }) => (
        <Textarea
          classNames={{
            input: "resize-y min-h-[40px]",
          }}
          disableAutosize
          disabled={isSubmitting}
          errorMessage={errors.description?.message}
          label={"Description"}
          onChange={(e) => field.onChange(e)}
          type={"text"}
          variant="bordered"
          {...field}
        />
      )}
    />*/
    /*<Controller
      control={control}
      name="description"
      render={({ field }) => <Index />}
    />*/
    <p>hey</p>
  );
};

export default Description;
