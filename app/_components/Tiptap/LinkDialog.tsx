"use client";

import { FC, useState, useCallback } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";

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
    <Modal isOpen={isOpen} onOpenChange={handleOpenChange} size="sm">
      <ModalContent>
        <ModalHeader>
          {hasExistingLink ? "Edit Link" : "Insert Link"}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="URL"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) validateUrl(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              isInvalid={!!error}
              errorMessage={error}
              autoFocus
              type="url"
            />
            <Switch
              isSelected={openInNewTab}
              onValueChange={setOpenInNewTab}
              size="sm"
            >
              Open in new tab
            </Switch>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex justify-between w-full">
            <div>
              {hasExistingLink && (
                <Button color="danger" variant="light" onPress={handleRemove}>
                  Remove Link
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                {hasExistingLink ? "Update" : "Insert"}
              </Button>
            </div>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LinkDialog;
