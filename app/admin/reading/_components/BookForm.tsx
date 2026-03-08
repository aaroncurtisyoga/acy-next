"use client";

import { FC } from "react";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BookFormSchema } from "@/app/_lib/schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { cn } from "@/app/_lib/utils";

type BookFormInputs = z.infer<typeof BookFormSchema>;

interface BookFormProps {
  defaultValues: BookFormInputs;
  onSubmit: (data: BookFormInputs) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

const BookForm: FC<BookFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Save Book",
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookFormInputs>({
    resolver: zodResolver(BookFormSchema),
    defaultValues,
  });

  const coverUrl = useWatch({ control, name: "coverImageUrl" });

  const handleFormSubmit: SubmitHandler<BookFormInputs> = async (data) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Cover preview — native img so partial URLs during typing degrade gracefully */}
      {coverUrl && (
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverUrl}
            alt="Cover preview"
            width={120}
            height={180}
            className="rounded-lg shadow-md object-cover"
          />
        </div>
      )}

      {/* Title */}
      <div className="space-y-1">
        <Label htmlFor="title">Title</Label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="title"
              className={cn(errors.title && "border-destructive")}
            />
          )}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Author */}
      <div className="space-y-1">
        <Label htmlFor="author">Author</Label>
        <Controller
          name="author"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="author"
              className={cn(errors.author && "border-destructive")}
            />
          )}
        />
        {errors.author && (
          <p className="text-sm text-destructive">{errors.author.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              id="description"
              rows={4}
              placeholder="Optional description..."
            />
          )}
        />
      </div>

      {/* Cover URL */}
      <div className="space-y-1">
        <Label htmlFor="coverImageUrl">Cover Image URL</Label>
        <Controller
          name="coverImageUrl"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="coverImageUrl"
              placeholder="https://..."
              className={cn(errors.coverImageUrl && "border-destructive")}
            />
          )}
        />
        {errors.coverImageUrl && (
          <p className="text-sm text-destructive">
            {errors.coverImageUrl.message}
          </p>
        )}
      </div>

      {/* Currently Reading toggle */}
      <div className="flex items-center gap-3">
        <Controller
          name="isCurrentlyReading"
          control={control}
          render={({ field }) => (
            <Switch
              id="isCurrentlyReading"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="isCurrentlyReading">Currently Reading</Label>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isSubmitting} className="font-medium">
          {isSubmitting && <Loader2 className="animate-spin" />}
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
          className="font-medium"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default BookForm;
