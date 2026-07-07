// Mirrors the validation enforced server-side by /api/upload-image.
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

export function imageUploadError(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Only JPG, PNG, GIF, and WebP images can be uploaded.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Images must be 5MB or smaller.";
  }
  return null;
}

/** Uploads an image to Vercel Blob via /api/upload-image; resolves to its URL. */
export async function uploadEditorImage(file: File): Promise<string> {
  const validationError = imageUploadError(file);
  if (validationError) throw new Error(validationError);

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload-image", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || "Failed to upload the image.");
  }

  const data = await response.json();
  return data.url as string;
}
