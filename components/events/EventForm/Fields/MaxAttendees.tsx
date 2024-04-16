import { Input } from "@nextui-org/react";
import { FC } from "react";
import { Control, Controller } from "react-hook-form";

interface PriceInputProps {
  control: Control;
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
