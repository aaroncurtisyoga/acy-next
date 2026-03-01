import { FC } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Control, Controller } from "react-hook-form";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";

interface IsHostedExternallyCheckboxProps {
  control: Control<EventFormValues>;
  isSubmitting: boolean;
}

const IsHostedExternallyCheckbox: FC<IsHostedExternallyCheckboxProps> = ({
  control,
  isSubmitting,
}) => {
  return (
    <Controller
      control={control}
      name={"isHostedExternally" satisfies keyof EventFormValues}
      render={({ field: { value, onChange, ...field } }) => (
        <div className="flex items-center gap-2">
          <Checkbox
            disabled={isSubmitting}
            checked={value}
            onCheckedChange={onChange}
            {...field}
          />
          <Label className="text-sm font-normal">
            People sign up on a different app
          </Label>
        </div>
      )}
    />
  );
};

export default IsHostedExternallyCheckbox;
