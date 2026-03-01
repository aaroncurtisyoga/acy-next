import { FC } from "react";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { cn } from "@/app/_lib/utils";
import {
  Control,
  Controller,
  FieldErrors,
  RegisterOptions,
} from "react-hook-form";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";

interface TitleInputProps {
  control: Control<EventFormValues>;
  isSubmitting: boolean;
  errors: FieldErrors<EventFormValues>;
  rules?: RegisterOptions<EventFormValues, "title">;
}

const TitleInput: FC<TitleInputProps> = ({
  control,
  isSubmitting,
  errors,
  rules,
}) => {
  return (
    <Controller
      control={control}
      name={"title" satisfies keyof EventFormValues}
      rules={rules}
      render={({ field }) => (
        <FormField
          label="Event Name"
          error={errors.title?.message}
          required={!!rules?.required}
        >
          <Input
            disabled={isSubmitting}
            className={cn(errors.title && "border-destructive")}
            type="text"
            value={field.value ?? ""}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            name={field.name}
          />
        </FormField>
      )}
    />
  );
};

export default TitleInput;
