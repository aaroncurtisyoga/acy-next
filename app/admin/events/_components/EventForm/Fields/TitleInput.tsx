import React, { FC } from "react";
import { Input } from "@heroui/react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";

interface TitleInputProps {
  control: Control<EventFormValues>;
  isSubmitting: boolean;
  errors: FieldErrors<EventFormValues>;
}

const TitleInput: FC<TitleInputProps> = ({ control, isSubmitting, errors }) => {
  return (
    <Controller
      control={control}
      name={"title" satisfies keyof EventFormValues}
      render={({ field }) => (
        <Input
          isDisabled={isSubmitting}
          isInvalid={!!errors.title}
          errorMessage={errors.title?.message}
          label={"Event Name"}
          onChange={field.onChange}
          type={"text"}
          variant="bordered"
          {...field}
        />
      )}
    />
  );
};

export default TitleInput;
