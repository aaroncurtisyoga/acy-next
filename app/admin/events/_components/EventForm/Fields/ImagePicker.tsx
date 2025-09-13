"use client";

import React, { FC, useState, useCallback } from "react";
import Image from "next/image";
import {
  Button,
  cn,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Chip,
  Progress,
  Card,
  CardBody,
} from "@heroui/react";
import { ImagePlus, Check, Upload, X, Image as ImageIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { FieldErrors, useWatch } from "react-hook-form";
import { getImages } from "@/app/_lib/actions/blob.actions";
import { EventFormValues } from "@/app/admin/events/_components/EventForm/EventFormProvider";

interface ImagePickerProps {
  errors: FieldErrors<EventFormValues>;
  setValue: any;
  control?: any;
}

const ImagePicker: FC<ImagePickerProps> = ({ errors, setValue, control }) => {
  const [images, setImages] = useState([]);
  const [selectedImgUrl, setSelectedImgUrl] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Always call the hook, but only use its value if control is provided
  const watchedImageUrl = useWatch({
    control: control || {},
    name: "imageUrl",
    disabled: !control,
  });
  const currentImageUrl = control ? watchedImageUrl : null;

  const handleGetImages = useCallback(async () => {
    const images = await getImages();
    setImages(images || []);
  }, []);

  const uploadImage = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("file", file);

      try {
        // Simulate progress (since fetch doesn't provide upload progress)
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90));
        }, 100);

        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);
        setUploadProgress(100);

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Upload failed");
        }

        const data = await response.json();
        setUploadedImageUrl(data.url);
        setValue("imageUrl", data.url);

        // Refresh images list
        handleGetImages();

        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 500);
      } catch (error) {
        console.error("Upload error:", error);
        setIsUploading(false);
        setUploadProgress(0);
        alert(
          error instanceof Error ? error.message : "Failed to upload image",
        );
      }
    },
    [setValue, handleGetImages],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        uploadImage(acceptedFiles[0]);
      }
    },
    [uploadImage],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const setHeroImage = () => {
    setValue("imageUrl", selectedImgUrl);
    onOpenChange();
  };

  const handlePressOpenButton = () => {
    handleGetImages();
    onOpen();
  };

  const clearImage = () => {
    setValue("imageUrl", "");
    setUploadedImageUrl(null);
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium">Event Image</label>

        {/* Drag and Drop Zone */}
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-default-300 hover:border-default-400",
            isUploading && "pointer-events-none opacity-60",
          )}
        >
          <input {...getInputProps()} />

          {isUploading ? (
            <div className="space-y-2">
              <Upload className="w-8 h-8 mx-auto text-primary animate-pulse" />
              <p className="text-sm text-default-600">Uploading...</p>
              <Progress value={uploadProgress} size="sm" color="primary" />
            </div>
          ) : isDragActive ? (
            <div className="space-y-2">
              <Upload className="w-8 h-8 mx-auto text-primary" />
              <p className="text-sm text-primary">Drop the image here</p>
            </div>
          ) : (
            <div className="space-y-2">
              <ImageIcon className="w-8 h-8 mx-auto text-default-400" />
              <p className="text-sm text-default-600">
                Drag & drop an image here, or click to select
              </p>
              <p className="text-xs text-default-400">
                JPG, PNG, GIF, WebP (max 5MB)
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons and Status */}
        <div className="flex items-center gap-3">
          <Button
            variant="flat"
            startContent={<ImagePlus className="w-4 h-4" />}
            onPress={handlePressOpenButton}
            size="sm"
            isDisabled={isUploading}
          >
            Choose from Gallery
          </Button>

          {currentImageUrl && (
            <div className="flex items-center gap-2">
              <Chip
                color="success"
                variant="flat"
                startContent={<Check className="w-3 h-3" />}
                onClose={clearImage}
                size="sm"
              >
                Image Selected
              </Chip>
            </div>
          )}
        </div>

        {/* Image Preview */}
        {currentImageUrl && (
          <Card className="max-w-[200px]">
            <CardBody className="p-2">
              <div className="relative w-full h-[100px]">
                <Image
                  src={currentImageUrl}
                  alt="Selected event image"
                  fill
                  className="object-cover rounded"
                />
              </div>
            </CardBody>
          </Card>
        )}

        {errors.imageUrl?.message && (
          <div className="text-tiny text-danger">{errors.imageUrl.message}</div>
        )}
      </div>

      {/* Gallery Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={"full"}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Choose from gallery
              </ModalHeader>
              <ModalBody
                className={
                  "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                }
              >
                {images?.map((image: any) => (
                  <div key={image.pathname} className={"relative aspect-video"}>
                    <Image
                      src={image.url}
                      alt={image.pathname}
                      sizes={"470px"}
                      onClick={() => setSelectedImgUrl(image.url)}
                      className={cn(
                        "object-cover overflow-hidden rounded-medium cursor-pointer transition-all",
                        "hover:opacity-75 hover:scale-105",
                        {
                          "ring-2 ring-primary ring-offset-2":
                            selectedImgUrl === image.url,
                        },
                      )}
                      fill={true}
                    />
                  </div>
                ))}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="bordered" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={setHeroImage}
                  isDisabled={!selectedImgUrl}
                >
                  Select Image
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ImagePicker;
