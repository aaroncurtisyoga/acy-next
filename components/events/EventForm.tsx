"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import ImageGallery from "@/components/events/ImageGallery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Dropdown from "@/components/ui/Dropdown";
import FileUpload from "@/components/shared/FileUpload";
import { Checkbox } from "@/components/ui/checkbox";

import { EventFormSchema } from "@/lib/schema";
import { eventDefaultValues } from "@/constants";
import "react-datepicker/dist/react-datepicker.css";
import { createEvent, updateEvent } from "@/lib/actions/event.actions";
import { IEvent } from "@/lib/mongodb/database/models/event.model";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

type EventFormProps = {
  event?: IEvent;
  type: "Create" | "Update";
};

const EventForm = ({ event, type }: EventFormProps) => {
  const router = useRouter();
  const [selectedImg, setSelectedImg] = useState("");
  const isUpdateAndEventExists = type === "Update" && event;
  const eventInitialValues = isUpdateAndEventExists
    ? {
        ...event,
        startDateTime: new Date(event.startDateTime),
        endDateTime: new Date(event.endDateTime),
      }
    : eventDefaultValues;
  const form = useForm<z.infer<typeof EventFormSchema>>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: eventInitialValues,
  });

  async function createNewEvent(values: z.infer<typeof EventFormSchema>) {
    try {
      const newEvent = await createEvent({ event: values, path: "/events" });

      if (newEvent) {
        form.reset();
        router.push(`/events/${newEvent._id}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function updateExistingEvent(values: z.infer<typeof EventFormSchema>) {
    try {
      const updatedEvent = await updateEvent({
        event: { ...values, _id: event._id },
        path: `/events/${event._id}`,
      });

      if (updatedEvent) {
        form.reset();
        router.push(`/events/${updatedEvent._id}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function onSubmit(values: z.infer<typeof EventFormSchema>) {
    if (!values.imgLarge || !values.imgThumbnail) {
      form.setError("root.random", {
        type: "random",
        message: "Dont forget to upload images",
      });
      return;
    }

    if (type === "Create") {
      await createNewEvent(values);
    }

    if (type === "Update") {
      if (event._id) {
        await updateExistingEvent(values);
      } else {
        router.back();
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={"flex flex-col gap-5"}
      >
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input {...field} placeholder="Event title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Dropdown
                    onChangeHandler={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-56">
                  <Textarea
                    placeholder="Description"
                    {...field}
                    className=" rounded-2xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="imgLarge"
            render={({ field }) => (
              <FormItem className="w-full">
                <Label htmlFor="imgLarge">Img large 940x470</Label>
                <FormControl className="h-72">
                  <FileUpload
                    imageUrl={field.value}
                    onFieldChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imgThumbnail"
            render={({ field }) => (
              <FormItem className="w-full">
                <Label htmlFor="imgThumbnail">Img thumbnail 50x25</Label>
                <FormControl className="h-72">
                  <FileUpload
                    imageUrl={field.value}
                    onFieldChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" variant={"outline"}>
              View Images from Vercel Blob Storage
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white min-w-[95vw] max-h-[85vh] overflow-scroll">
            <DialogHeader className={"flex flex-row gap-3 items-baseline"}>
              <Button
                type="button"
                variant="default"
                disabled={!selectedImg}
                onClick={() => {
                  form.setValue("imgLarge", selectedImg);
                  setSelectedImg("");
                }}
              >
                Set as Primary 940x470 img
              </Button>
              <Button
                className={"mt-[0px] m-[0px]"}
                type="button"
                variant="outline"
                disabled={!selectedImg}
                onClick={() => {
                  form.setValue("imgThumbnail", selectedImg);
                  setSelectedImg("");
                }}
              >
                Set as Small 50x25 Img
              </Button>
            </DialogHeader>
            <ImageGallery setSelectedImg={setSelectedImg} />
          </DialogContent>
        </Dialog>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center w-full">
                    <Input placeholder="Location" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="startDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <DatePicker
                    selected={field.value}
                    onChange={(date: Date) => field.onChange(date)}
                    showTimeSelect
                    timeInputLabel="Time:"
                    dateFormat="MM/dd/yyyy h:mm aa"
                    wrapperClassName="datePicker"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <DatePicker
                    selected={field.value}
                    onChange={(date: Date) => field.onChange(date)}
                    showTimeSelect
                    timeInputLabel="Time:"
                    dateFormat="MM/dd/yyyy h:mm aa"
                    wrapperClassName="datePicker"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input type="number" placeholder="Price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isFree"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Checkbox
                    onCheckedChange={field.onChange}
                    checked={field.value}
                    id="isFree"
                    className="mr-2 h-5 w-5 border-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="col-span-2 w-full"
        >
          {form.formState.isSubmitting ? "Submitting..." : `${type} Event `}
        </Button>
      </form>
    </Form>
  );
};

export default EventForm;
