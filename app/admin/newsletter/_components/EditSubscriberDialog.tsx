"use client";

import { FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { Subscriber } from "@/app/_lib/actions/newsletter.actions";

const EditSubscriberFormSchema = z.object({
  firstName: z.string().max(100, "100 characters or fewer").optional(),
  lastName: z.string().max(100, "100 characters or fewer").optional(),
  subscribed: z.boolean(),
});

type EditSubscriberFormInputs = z.infer<typeof EditSubscriberFormSchema>;

export type SubscriberEdit = {
  firstName: string;
  lastName: string;
  unsubscribed: boolean;
};

interface EditSubscriberDialogProps {
  /** The subscriber being edited; `null` closes the dialog. */
  subscriber: Subscriber | null;
  onClose: () => void;
  /** Returns true on success so the dialog can close itself. */
  onSave: (edit: SubscriberEdit) => Promise<boolean>;
}

const EditSubscriberDialog: FC<EditSubscriberDialogProps> = ({
  subscriber,
  onClose,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditSubscriberFormInputs>({
    resolver: zodResolver(EditSubscriberFormSchema),
    defaultValues: { firstName: "", lastName: "", subscribed: true },
  });

  // Re-seed the form each time a different subscriber opens the dialog.
  useEffect(() => {
    if (subscriber) {
      reset({
        firstName: subscriber.firstName ?? "",
        lastName: subscriber.lastName ?? "",
        subscribed: !subscriber.unsubscribed,
      });
    }
  }, [subscriber, reset]);

  const onSubmit = async (data: EditSubscriberFormInputs) => {
    const ok = await onSave({
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      unsubscribed: !data.subscribed,
    });
    if (ok) onClose();
  };

  const handleOpenChange = (next: boolean) => {
    if (isSubmitting) return;
    if (!next) onClose();
  };

  return (
    <Dialog open={!!subscriber} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit subscriber</DialogTitle>
          <DialogDescription className="truncate">
            {subscriber?.email}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="First name" error={errors.firstName?.message}>
              <Input
                {...register("firstName")}
                placeholder="Optional"
                disabled={isSubmitting}
              />
            </FormField>
            <FormField label="Last name" error={errors.lastName?.message}>
              <Input
                {...register("lastName")}
                placeholder="Optional"
                disabled={isSubmitting}
              />
            </FormField>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div className="pr-4">
              <p className="text-sm font-medium text-foreground">Subscribed</p>
              <p className="text-xs text-muted-foreground">
                Unsubscribed people stay on the list but won&apos;t receive
                broadcasts.
              </p>
            </div>
            <Controller
              name="subscribed"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                  aria-label="Subscribed"
                />
              )}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSubscriberDialog;
