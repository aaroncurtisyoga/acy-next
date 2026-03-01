"use client";

import { FC } from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form-field";
import { cn } from "@/app/_lib/utils";
import LocationInput from "@/app/admin/events/_components/EventForm/Fields/LocationInput";
import StartDatePickerInput from "@/app/admin/events/_components/EventForm/Fields/StartDatePickerInput";
import EndDatePickerInput from "@/app/admin/events/_components/EventForm/Fields/EndDatePickerInput";
import { PlaceDetails } from "@/app/_lib/types";
import type { QuickEventFormData } from "@/app/(root)/_components/QuickAddEvent/useQuickAddForm";

interface QuickAddFormFieldsProps {
  control: Control<QuickEventFormData>;
  errors: FieldErrors<QuickEventFormData>;
  categories: Array<{ id: string; name: string }>;
  isSubmitting: boolean;
  isFree: boolean;
  isHostedExternally: boolean;
  setLocationValue: (placeDetails: PlaceDetails) => void;
  onStartDateChange: (date: any) => void;
}

const QuickAddFormFields: FC<QuickAddFormFieldsProps> = ({
  control,
  errors,
  categories,
  isSubmitting,
  isFree,
  isHostedExternally,
  setLocationValue,
  onStartDateChange,
}) => {
  return (
    <div className="space-y-4 px-6 py-4">
      <Controller
        name="title"
        control={control}
        rules={{ required: "Event title is required" }}
        render={({ field }) => (
          <FormField label="Event Title" error={errors.title?.message} required>
            <Input
              {...field}
              placeholder="Enter event title"
              className={cn(errors.title && "border-destructive")}
            />
          </FormField>
        )}
      />

      <LocationInput
        control={control as any}
        setLocationValueInReactHookForm={setLocationValue}
        errors={errors}
      />

      <Controller
        name="category"
        control={control}
        rules={{ required: "Category is required" }}
        render={({ field }) => (
          <FormField label="Category" error={errors.category?.message} required>
            <Select value={field.value || ""} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <StartDatePickerInput
          control={control as any}
          errors={errors}
          isSubmitting={isSubmitting}
          onChange={onStartDateChange}
        />
        <EndDatePickerInput
          control={control as any}
          errors={errors}
          isSubmitting={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="isFree"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label className="text-sm">Free Event</Label>
            </div>
          )}
        />
        <Controller
          name="isHostedExternally"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label className="text-sm">External Event</Label>
            </div>
          )}
        />
      </div>

      {!isFree && (
        <Controller
          name="price"
          control={control}
          rules={{
            required: !isFree ? "Price is required" : false,
            pattern: {
              value: /^\d+(\.\d{0,2})?$/,
              message: "Please enter a valid price",
            },
          }}
          render={({ field }) => (
            <FormField label="Price" error={errors.price?.message} required>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  $
                </span>
                <Input
                  {...field}
                  type="text"
                  placeholder="0.00"
                  className={cn("pl-7", errors.price && "border-destructive")}
                />
              </div>
            </FormField>
          )}
        />
      )}

      {isHostedExternally && (
        <>
          <Controller
            name="externalUrl"
            control={control}
            render={({ field }) => (
              <FormField label="Event Website URL">
                <Input
                  {...field}
                  type="url"
                  placeholder="https://example.com/event"
                />
              </FormField>
            )}
          />
          <Controller
            name="externalRegistrationUrl"
            control={control}
            render={({ field }) => (
              <FormField label="Registration URL">
                <Input
                  {...field}
                  type="url"
                  placeholder="https://example.com/register"
                />
              </FormField>
            )}
          />
        </>
      )}
    </div>
  );
};

export default QuickAddFormFields;
