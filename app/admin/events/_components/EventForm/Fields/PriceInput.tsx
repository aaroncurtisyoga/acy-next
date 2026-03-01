import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form-field";
import { cn } from "@/app/_lib/utils";
import { Control, Controller, FieldErrors, useWatch } from "react-hook-form";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";

interface PriceInputProps {
  control: Control<EventFormValues>;
  isSubmitting: boolean;
  errors: FieldErrors<EventFormValues>;
}

const PriceInput: FC<PriceInputProps> = ({ control, isSubmitting, errors }) => {
  const isFree = useWatch({ control, name: "isFree" });

  return (
    <div className="space-y-4">
      <Controller
        control={control}
        name={"price" satisfies keyof EventFormValues}
        render={({ field }) => (
          <FormField label="Price" error={errors.price?.message}>
            <div className="relative">
              {!isFree && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  $
                </span>
              )}
              <Input
                disabled={isSubmitting || isFree}
                className={cn(
                  !isFree && "pl-7",
                  errors.price && "border-destructive",
                )}
                placeholder={isFree ? "Free" : "0.00"}
                type="number"
                value={isFree ? "" : (field.value ?? "")}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                name={field.name}
              />
            </div>
          </FormField>
        )}
      />

      <Controller
        control={control}
        name={"isFree" satisfies keyof EventFormValues}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Switch
              disabled={isSubmitting}
              checked={field.value ?? false}
              onCheckedChange={(value) => {
                field.onChange(value);
                if (value) {
                  control._formValues.price = "";
                }
              }}
            />
            <Label className="text-sm">This is a free event</Label>
          </div>
        )}
      />
    </div>
  );
};

export default PriceInput;
