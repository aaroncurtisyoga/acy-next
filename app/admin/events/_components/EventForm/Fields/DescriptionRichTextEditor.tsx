import { FC } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import Tiptap from "@/components/Tiptap";
import { Inputs } from "@/app/admin/events/_components/EventForm/Steps/DetailsForInternallyHostedEvent";

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
          onChange={(e) => field.onChange(e)}
          description={field.name}
          errorMessage={errors.description?.message}
        />
      )}
    />
  );
};

export default DescriptionRichTextEditor;
