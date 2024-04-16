import { Input } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { FC } from "react";

interface PriceInputProps {
  control: any;
  isSubmitting: boolean;
  errors: any;
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
