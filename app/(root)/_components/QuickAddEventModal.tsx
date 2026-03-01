"use client";

import { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import QuickAddFormFields from "@/app/(root)/_components/QuickAddEvent/QuickAddFormFields";
import { useQuickAddForm } from "@/app/(root)/_components/QuickAddEvent/useQuickAddForm";

interface QuickAddEventModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  categories: Array<{ id: string; name: string }>;
}

const QuickAddEventModal: FC<QuickAddEventModalProps> = ({
  isOpen,
  onOpenChange,
  categories,
}) => {
  const {
    form,
    isSubmitting,
    isHostedExternally,
    isFree,
    setLocationValue,
    handleStartDateChange,
    onSubmit,
    handleAdvancedCreate,
  } = useQuickAddForm(onOpenChange);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Quick Add Event</DialogTitle>
          </DialogHeader>

          <QuickAddFormFields
            control={control}
            errors={errors}
            categories={categories}
            isSubmitting={isSubmitting}
            isFree={isFree}
            isHostedExternally={isHostedExternally}
            setLocationValue={setLocationValue}
            onStartDateChange={handleStartDateChange}
          />

          <DialogFooter className="mt-4">
            <Button variant="secondary" onClick={handleAdvancedCreate}>
              Create Advanced
            </Button>
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() => onOpenChange()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" size={16} />}
              {isSubmitting ? "Creating..." : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickAddEventModal;
