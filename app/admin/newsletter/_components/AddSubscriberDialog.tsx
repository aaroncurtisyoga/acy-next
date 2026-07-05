"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { addSubscriber } from "@/app/_lib/actions/newsletter.actions";
import { NewsletterSubscriberSchema } from "@/app/_lib/schema";

type SubscriberInputs = z.infer<typeof NewsletterSubscriberSchema>;

interface AddSubscriberDialogProps {
  onAdded: () => Promise<void> | void;
}

const AddSubscriberDialog: FC<AddSubscriberDialogProps> = ({ onAdded }) => {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SubscriberInputs>({
    resolver: zodResolver(NewsletterSubscriberSchema),
  });

  const onSubmit = async (data: SubscriberInputs) => {
    const result = await addSubscriber(data);

    if (!result.status) {
      if (result.field === "email") {
        setError("email", { type: "manual", message: result.message });
      } else {
        toast.error(result.message);
      }
      return;
    }

    toast.success(result.message);
    reset();
    setOpen(false);
    await onAdded();
  };

  const handleOpenChange = (next: boolean) => {
    if (isSubmitting) return;
    if (!next) reset();
    setOpen(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-medium">
          <UserPlus className="w-4 h-4" /> Add Subscriber
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add subscriber</DialogTitle>
          <DialogDescription>
            Add someone to the newsletter list. They&apos;ll receive future
            broadcasts and can unsubscribe anytime.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Email" error={errors.email?.message} required>
            <Input
              {...register("email")}
              type="email"
              placeholder="name@example.com"
              autoFocus
              disabled={isSubmitting}
            />
          </FormField>

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

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Adding..." : "Add subscriber"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubscriberDialog;
