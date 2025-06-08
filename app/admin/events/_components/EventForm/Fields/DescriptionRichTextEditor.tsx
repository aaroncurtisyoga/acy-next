import React, { FC } from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import Tiptap from "@/app/_components/Tiptap";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";

interface DescriptionRichTextEditorProps {
  control: Control<EventFormValues>;
  errors: FieldErrors<EventFormValues>;
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
