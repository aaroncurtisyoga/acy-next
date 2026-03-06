import { FC } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface BasicModalProps {
  children?: React.ReactNode;
  header?: string | React.ReactNode;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  primaryAction?: () => void;
  primaryActionLabel?: string;
  placement?: "auto" | "top" | "center" | "bottom";
  hideButtons?: boolean;
}

const BasicModal: FC<BasicModalProps> = ({
  children,
  header,
  isOpen,
  onOpenChange,
  primaryAction,
  primaryActionLabel,
  hideButtons = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="pb-8">
        {header && (
          <DialogHeader>
            <DialogTitle>{header}</DialogTitle>
          </DialogHeader>
        )}
        <div>{children}</div>
        {
          // If hideButtons is false, render the buttons
          !hideButtons && (
            <DialogFooter>
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              {primaryAction && (
                <Button onClick={primaryAction}>{primaryActionLabel}</Button>
              )}
            </DialogFooter>
          )
        }
      </DialogContent>
    </Dialog>
  );
};

export default BasicModal;
