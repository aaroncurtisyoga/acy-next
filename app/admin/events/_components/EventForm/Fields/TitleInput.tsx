import { FC } from "react";
import { Input } from "@heroui/input";
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
        <Input
          isDisabled={isSubmitting}
          isInvalid={!!errors.title}
          errorMessage={errors.title?.message}
          label={"Event Name"}
          type={"text"}
          variant="bordered"
          isRequired={!!rules?.required}
          value={field.value ?? ""}
          onChange={(e) => field.onChange(e.target.value)}
          onBlur={field.onBlur}
          name={field.name}
        />
      )}
    />
  );
};

export default TitleInput;
