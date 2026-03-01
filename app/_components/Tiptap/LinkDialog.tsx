"use client";

import { FC, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface LinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string, openInNewTab: boolean) => void;
  onRemove: () => void;
  initialUrl?: string;
  hasExistingLink: boolean;
}

const LinkDialog: FC<LinkDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onRemove,
  initialUrl = "",
  hasExistingLink,
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reset state when dialog opens using onOpenChange
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        setUrl(initialUrl);
        setOpenInNewTab(true);
        setError(null);
      } else {
        onClose();
      }
    },
    [initialUrl, onClose],
  );

  const validateUrl = (value: string): boolean => {
    if (!value.trim()) {
      setError("URL is required");
      return false;
    }
    if (!/^https?:\/\/.+/.test(value)) {
      setError("URL must start with http:// or https://");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = () => {
    if (validateUrl(url)) {
      onSubmit(url, openInNewTab);
      onClose();
    }
  };

  const handleRemove = () => {
    onRemove();
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {hasExistingLink ? "Edit Link" : "Insert Link"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>URL</Label>
            <Input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) validateUrl(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              className={error ? "border-destructive" : ""}
              autoFocus
              type="url"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={openInNewTab} onCheckedChange={setOpenInNewTab} />
            <Label className="text-sm">Open in new tab</Label>
          </div>
        </div>
        <DialogFooter>
          <div className="flex justify-between w-full">
            <div>
              {hasExistingLink && (
                <Button
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={handleRemove}
                >
                  Remove Link
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {hasExistingLink ? "Update" : "Insert"}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LinkDialog;
