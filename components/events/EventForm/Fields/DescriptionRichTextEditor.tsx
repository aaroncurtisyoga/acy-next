import { Controller } from "react-hook-form";
import Tiptap from "@/components/shared/Tiptap";

const DescriptionRichTextEditor = ({ control, isSubmitting, errors }) => {
  return (
    <Controller
      control={control}
      name="description"
      render={({ field }) => (
        <Tiptap onChange={(e) => field.onChange(e)} description={field.name} />
      )}
    />
  );
};

export default DescriptionRichTextEditor;
