"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { createEvent, updateEvent } from "@/lib/actions/event.actions";
import { IEvent } from "@/lib/mongodb/database/models/event.model";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  autocompleteSuggestions,
  placeDetails,
} from "@/lib/actions/google.actions";

type EventFormProps = {
  event?: IEvent;
  type: "Create" | "Update";
};
import "react-datepicker/dist/react-datepicker.css";

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
  const [locationSearch, setLocationSearch] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isOpenLocationDropdown, setIsOpenLocationDropdown] = useState(false);
  const watchStartDateTime = form.watch("startDateTime");

  useEffect(() => {
    if (!locationSearch || locationSearch.trim().length <= 3) {
      return;
    }
    autocompleteSuggestions(locationSearch).then((r) => {
      setLocationSuggestions(r);
      setIsOpenLocationDropdown(true);
    });
  }, [locationSearch]);

  useEffect(() => {
    if (watchStartDateTime > form.getValues("endDateTime")) {
      form.setValue(
        "endDateTime",
        new Date(watchStartDateTime.getTime() + 60 * 60 * 1000),
      );
    }
  }, [form, watchStartDateTime]);
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

  const handleSelectLocation = async (placeId: string) => {
    await placeDetails(placeId).then((r) => setValueLocation(r));
  };

  const setValueLocation = async (placeDetails) => {
    form.setValue("location", {
      formattedAddress: placeDetails.formatted_address,
      geometry: placeDetails.geometry.location,
      name: placeDetails.name,
      placeId: placeDetails.place_id,
    });
    setLocationSearch(placeDetails.formatted_address);
    setIsOpenLocationDropdown(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Category</FormLabel>
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
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imgLarge"
          render={({ field }) => (
            <FormItem className="w-full">
              <Label>Large Image: 940 x 470</Label>
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
              <Label>Small Image: 50 x 25</Label>
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

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <Command>
              <FormItem className="flex flex-col">
                <FormLabel>Location</FormLabel>
                <Popover
                  open={isOpenLocationDropdown}
                  onOpenChange={setIsOpenLocationDropdown}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <CommandInput
                        placeholder="Find location..."
                        className="h-9"
                        onValueChange={(value) => {
                          setLocationSearch(value);
                        }}
                        value={locationSearch}
                      />
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <CommandGroup>
                      {locationSuggestions.map((location) => (
                        <CommandItem
                          value={location.description}
                          key={location.place_id}
                          onSelect={() =>
                            handleSelectLocation(location.place_id)
                          }
                        >
                          {location.description}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            </Command>
          )}
        />

        <FormField
          control={form.control}
          name="startDateTime"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Start Time/Date</FormLabel>
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
              <FormLabel>End Time/Date</FormLabel>
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
          name="price"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
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
              <div className="items-top flex space-x-2">
                <FormControl>
                  <Checkbox
                    onCheckedChange={field.onChange}
                    checked={field.value}
                    id="isFree"
                  />
                </FormControl>
                <FormLabel>Is Free</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

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
