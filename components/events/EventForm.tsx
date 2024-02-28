"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import {
  Button,
  Input,
  Select,
  SelectItem,
  SelectSection,
  Textarea,
} from "@nextui-org/react";
import * as z from "zod";
import { createEvent, updateEvent } from "@/lib/actions/event.actions";
import {
  createCategory,
  getAllCategories,
} from "@/lib/actions/category.actions";
import { EventFormSchema } from "@/lib/schema";
import { eventDefaultValues } from "@/constants";
import { IEvent } from "@/lib/mongodb/database/models/event.model";
import { ICategory } from "@/lib/mongodb/database/models/category.model";
import "react-datepicker/dist/react-datepicker.css";

type EventFormProps = {
  event?: IEvent;
  type: "Create" | "Update";
};

const EventForm = ({ event, type }: EventFormProps) => {
  const router = useRouter();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const isUpdateAndEventExists = type === "Update" && event;
  const eventInitialValues = isUpdateAndEventExists
    ? {
        ...event,
        startDateTime: new Date(event.startDateTime),
        endDateTime: new Date(event.endDateTime),
      }
    : eventDefaultValues;
  const {
    watch,
    getValues,
    setValue,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof EventFormSchema>>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: eventInitialValues,
  });
  const watchStartDateTime = watch("startDateTime");

  const getCategories = async () => {
    const categoryList = await getAllCategories();
    categoryList && setCategories(categoryList as ICategory[]);
  };

  useEffect(() => {
    if (watchStartDateTime > getValues("endDateTime")) {
      const startTimeStamp = watchStartDateTime.getTime();
      const oneHourInMilliseconds = 3600000;
      setValue("endDateTime", new Date(startTimeStamp + oneHourInMilliseconds));
    }
  }, [getValues, setValue, watchStartDateTime]);

  useEffect(() => {
    getCategories();
  }, []);

  const onSubmit = async (data: z.infer<typeof EventFormSchema>) => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name={"title"}
        render={({ field }) => (
          <Input
            disabled={isSubmitting}
            errorMessage={errors.title?.message}
            label={"Title"}
            onChange={(e) => field.onChange(e)}
            type={"text"}
            variant="bordered"
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name={"categoryId"}
        render={({ field }) => (
          <Select
            label={"Category"}
            className={"max-w-xs"}
            {...field}
            variant={"bordered"}
            errorMessage={errors.categoryId?.message}
          >
            {categories.length > 0 &&
              categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
          </Select>
        )}
      />
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <Textarea
            classNames={{
              input: "resize-y min-h-[40px]",
            }}
            disableAutosize
            disabled={isSubmitting}
            errorMessage={errors.description?.message}
            label={"Description"}
            onChange={(e) => field.onChange(e)}
            type={"text"}
            variant="bordered"
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name={"price"}
        render={({ field }) => (
          <Input
            disabled={isSubmitting}
            errorMessage={errors.price?.message}
            label={"Price"}
            onChange={(e) => field.onChange(e)}
            type={"number"}
            variant="bordered"
            {...field}
          />
        )}
      />

      <Controller
        control={control}
        name={"startDateTime"}
        render={({ field }) => (
          <>
            <DatePicker
              selected={field.value}
              onChange={(date: Date) => field.onChange(date)}
              showTimeSelect
              timeInputLabel={"Start Date/Time:"}
              dateFormat="MM/dd/yyyy h:mm aa"
              wrapperClassName="datePicker"
              placeholderText={"Start Date/Time"}
            />
          </>
        )}
      />

      <Controller
        control={control}
        name={"endDateTime"}
        render={({ field }) => (
          <DatePicker
            selected={field.value}
            onChange={(date: Date) => field.onChange(date)}
            showTimeSelect
            timeInputLabel={"End Date/Time:"}
            dateFormat="MM/dd/yyyy h:mm aa"
            wrapperClassName="datePicker"
            placeholderText={"End Date/Time"}
          />
        )}
      />

      <Button color={"primary"} type="submit">
        {type} Event
      </Button>
    </form>
  );
};

export default EventForm;
