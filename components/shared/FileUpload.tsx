"use client";

import type { PutBlobResult } from "@vercel/blob";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";

export default function FileUpload({ imageUrl, onFieldChange }: any) {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const uploadImage = async () => {
    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }

    const file = inputFileRef.current.files[0];
    const response = await fetch(`/api/uploadBlob?filename=${file.name}`, {
      method: "POST",
      body: file,
    });
    const newBlob = (await response.json()) as PutBlobResult;

    onFieldChange(newBlob.url);
  };

  return (
    <div className={"flex flex-col"}>
      <div className={"flex w-full justify-between"}>
        <input ref={inputFileRef} type="file" />
        <Button type="button" variant={"outline"} onClick={() => uploadImage()}>
          Upload
        </Button>
      </div>

      {imageUrl && (
        <div className={"w-full"}>
          <a
            href={imageUrl}
            target="_blank"
            className={"text-blue-500 hover:text-blue-800"}
          >
            <Link width={16} className={"float-left mr-1"} /> Link to uploaded
            image
          </a>
        </div>
      )}
    </div>
  );
}
