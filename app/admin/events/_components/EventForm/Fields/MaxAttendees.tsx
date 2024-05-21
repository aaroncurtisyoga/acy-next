import { Input } from "@nextui-org/react";
import { FC } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Inputs } from "@/components/events/EventForm/Steps/DetailsForInternallyHostedEvent";

interface PriceInputProps {
  control: Control;
  isSubmitting: boolean;
  errors: FieldErrors<Inputs>;
}

const PriceInput: FC<PriceInputProps> = ({ control, isSubmitting, errors }) => {
  return (
    <Controller
      control={control}
      name={"maxAttendees"}
      render={({ field: { onChange, ...field } }) => (
        <Input
          disabled={isSubmitting}
          errorMessage={errors.maxAttendees?.message}
          label={"Max Attendees"}
          onChange={(e) => onChange(Number(e.target.value))}
          type={"number"}
          variant="bordered"
          {...field}
        />
      )}
    />
  );
};

export default PriceInput;
