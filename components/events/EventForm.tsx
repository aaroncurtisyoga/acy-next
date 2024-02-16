"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { getGoogleMapsApiClient } from "@/lib/googleMaps";
import AutocompletePrediction = google.maps.places.AutocompletePrediction;

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
  const [locationSearch, setLocationSearch] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const sessionTokenRef = useRef<string>();
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // This gets debounced inside the fn itself
    loadGoogleMapsLocationSuggestions(locationSearch);
  }, [locationSearch]);

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

  const loadGoogleMapsLocationSuggestions = async (inputValue: string) => {
    clearTimeout(timeoutRef.current);

    if (!inputValue || inputValue.trim().length <= 3) {
      setLocationSuggestions([]);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      const google = await getGoogleMapsApiClient();
      if (!sessionTokenRef.current) {
        sessionTokenRef.current =
          new google.maps.places.AutocompleteSessionToken();
      }

      // @see https://developers.google.com/maps/documentation/javascript/place-autocomplete
      await new google.maps.places.AutocompleteService().getPlacePredictions(
        {
          input: inputValue,
          sessionToken: sessionTokenRef.current,
        },
        (predictions: Array<AutocompletePrediction>, status) => {
          if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            setLocationSuggestions([]);
            return;
          }
          if (
            status !== google.maps.places.PlacesServiceStatus.OK ||
            !predictions
          ) {
            console.log("Error fetching location suggestions");
            return;
          }
          setLocationSuggestions(predictions);
        },
      );
    }, 350);
  };

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
        </div>

        <div className="flex flex-col gap-5">
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
        </div>

        <div className="flex flex-col gap-5 md:flex-row items-end">
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
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <Command>
                <FormItem className="flex flex-col">
                  <FormLabel>Location</FormLabel>
                  <Popover open={!!locationSuggestions.length}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <CommandInput
                          placeholder="Search framework..."
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
                            onSelect={() => {
                              form.setValue("location", location);
                              setLocationSearch(location.description);
                            }}
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
        </div>

        <div className="grid grid-cols-3 gap-5 md:flex-row items-end">
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
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="col-span-2 w-full"
        >
          {form.formState.isSubmitting ? "Submitting..." : `${type} Event `}
        </Button>
        <DevTool control={form.control} />
      </form>
    </Form>
  );
};

export default EventForm;
