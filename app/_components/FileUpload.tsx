"use client";

import { useRef } from "react";
import type { PutBlobResult } from "@vercel/blob";

export default function FileUpload({ imageUrl, onFieldChange }: any) {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const uploadImage = async () => {
    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }

    const file = inputFileRef.current.files[0];
    const response = await fetch(`/api/upload-blob?filename=${file.name}`, {
      method: "POST",
      body: file,
    });
    const newBlob = (await response.json()) as PutBlobResult;

    onFieldChange(newBlob.url);
  };

  return (
    <div>
      <div>
        <input ref={inputFileRef} type="file" />
        <button type="button" onClick={() => uploadImage()}>
          Upload
        </button>
      </div>

      {imageUrl && (
        <div>
          <a href={imageUrl} target="_blank">
            Link to uploaded image
          </a>
        </div>
      )}
    </div>
  );
}
