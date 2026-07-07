"use client";

import { FC, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { Image as ImageIcon, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/app/_lib/utils";
import { getImages } from "@/app/_lib/actions/blob.actions";
import { uploadEditorImage } from "@/app/_components/Tiptap/image-upload";

interface ImageGalleryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called with the chosen image URL (freshly uploaded or from the gallery). */
  onSelect: (url: string) => void;
}

type BlobImage = { url: string; pathname: string };

/**
 * Upload-or-pick image dialog backed by Vercel Blob: drop/click to upload a
 * new image, or choose one already in the gallery. Uploading selects the
 * image immediately.
 */
const ImageGalleryDialog: FC<ImageGalleryDialogProps> = ({
  open,
  onOpenChange,
  onSelect,
}) => {
  const [images, setImages] = useState<BlobImage[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!open) {
      setSelectedUrl(null);
      return;
    }
    getImages()
      .then((blobs) => setImages(blobs || []))
      .catch(() => setImages([]));
  }, [open]);

  const handleUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setUploadProgress(0);
      // fetch has no upload progress; tick toward 90% then jump on finish
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      try {
        const url = await uploadEditorImage(file);
        setUploadProgress(100);
        onSelect(url);
        onOpenChange(false);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to upload image",
        );
      } finally {
        clearInterval(progressInterval);
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [onSelect, onOpenChange],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) handleUpload(acceptedFiles[0]);
    },
    [handleUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // Without this, a rejected file (too big, wrong type) is a silent no-op —
    // onDrop never fires and the dialog just sits there looking broken.
    onDropRejected: (rejections) => {
      const code = rejections[0]?.errors?.[0]?.code;
      toast.error(
        code === "file-too-large"
          ? "Images must be 5MB or smaller."
          : "Only JPG, PNG, GIF, and WebP images can be uploaded.",
      );
    },
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleInsertSelected = () => {
    if (!selectedUrl) return;
    onSelect(selectedUrl);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] flex flex-col"
        // The insert callback already puts focus back in the editor — letting
        // Radix refocus the toolbar button would immediately yank it away.
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add an image</DialogTitle>
          <DialogDescription>
            Upload a new image or pick one you&apos;ve used before.
          </DialogDescription>
        </DialogHeader>

        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-border hover:border-muted-foreground/40",
            isUploading && "pointer-events-none opacity-60",
          )}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="space-y-2">
              <Upload className="w-8 h-8 mx-auto text-primary animate-pulse" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
              <Progress value={uploadProgress} className="h-1" />
            </div>
          ) : isDragActive ? (
            <div className="space-y-2">
              <Upload className="w-8 h-8 mx-auto text-primary" />
              <p className="text-sm text-primary">Drop the image here</p>
            </div>
          ) : (
            <div className="space-y-2">
              <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag &amp; drop an image here, or click to select
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, GIF, WebP (max 5MB) — smaller images keep the email
                fast to load
              </p>
            </div>
          )}
        </div>

        {images.length > 0 && (
          <>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Or choose from the gallery
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1 overflow-y-auto min-h-0">
              {images.map((image) => (
                <button
                  key={image.pathname}
                  type="button"
                  onClick={() => setSelectedUrl(image.url)}
                  aria-label={`Select ${image.pathname}`}
                  aria-pressed={selectedUrl === image.url}
                  className={cn(
                    "relative aspect-video overflow-hidden rounded-md transition-all",
                    "hover:opacity-75 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none",
                    {
                      "ring-2 ring-primary ring-offset-2":
                        selectedUrl === image.url,
                    },
                  )}
                >
                  <Image
                    src={image.url}
                    alt=""
                    sizes="300px"
                    className="object-cover"
                    fill
                  />
                </button>
              ))}
            </div>
          </>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInsertSelected} disabled={!selectedUrl}>
            Insert Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageGalleryDialog;
