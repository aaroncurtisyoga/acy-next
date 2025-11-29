"use client";

import { FC } from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { ModalBody } from "@heroui/modal";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Checkbox } from "@heroui/checkbox";
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
    <ModalBody className="gap-4">
      <Controller
        name="title"
        control={control}
        rules={{ required: "Event title is required" }}
        render={({ field }) => (
          <Input
            {...field}
            label="Event Title"
            placeholder="Enter event title"
            isRequired
            errorMessage={errors.title?.message}
            isInvalid={!!errors.title}
          />
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
          <Select
            {...field}
            label="Category"
            placeholder="Select a category"
            isRequired
            errorMessage={errors.category?.message}
            isInvalid={!!errors.category}
          >
            {categories.map((category) => (
              <SelectItem key={category.id}>{category.name}</SelectItem>
            ))}
          </Select>
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
            <Checkbox isSelected={field.value} onValueChange={field.onChange}>
              Free Event
            </Checkbox>
          )}
        />
        <Controller
          name="isHostedExternally"
          control={control}
          render={({ field }) => (
            <Checkbox isSelected={field.value} onValueChange={field.onChange}>
              External Event
            </Checkbox>
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
            <Input
              {...field}
              type="text"
              label="Price"
              placeholder="0.00"
              startContent="$"
              isRequired={!isFree}
              errorMessage={errors.price?.message}
              isInvalid={!!errors.price}
            />
          )}
        />
      )}

      {isHostedExternally && (
        <>
          <Controller
            name="externalUrl"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="url"
                label="Event Website URL"
                placeholder="https://example.com/event"
              />
            )}
          />
          <Controller
            name="externalRegistrationUrl"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="url"
                label="Registration URL"
                placeholder="https://example.com/register"
              />
            )}
          />
        </>
      )}
    </ModalBody>
  );
};

export default QuickAddFormFields;
