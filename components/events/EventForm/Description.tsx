import React from "react";
import { Controller } from "react-hook-form";
import RichTextEditor from "@/components/shared/RichTextEditor";

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
      render={({ field }) => <RichTextEditor />}
    />*/
    <p>hey</p>
  );
};

export default Description;
