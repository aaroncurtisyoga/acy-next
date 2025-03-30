import React, { FC } from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import Tiptap from "@/app/_components/Tiptap";
import { Inputs } from "../Steps/BasicInfo"; // Adjust path as needed

interface DescriptionRichTextEditorProps {
  control: Control;
  errors: FieldErrors<Inputs>;
}

const DescriptionRichTextEditor: FC<DescriptionRichTextEditorProps> = ({
  control,
  errors,
}) => {
  return (
    <Controller
      control={control}
      name="description"
      render={({ field }) => (
        <Tiptap
          description="Description"
          placeholder="Enter event description..."
          errorMessage={errors.description?.message}
          onChange={field.onChange}
          initialContent={field.value || ""}
        />
      )}
    />
  );
};

export default DescriptionRichTextEditor;
