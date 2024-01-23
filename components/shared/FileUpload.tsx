"use client";

import type { PutBlobResult } from "@vercel/blob";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function FileUpload({ imageUrl, setImageUrl }) {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const uploadImage = async () => {
    console.log("handleImageUpload triggered");
    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }

    const file = inputFileRef.current.files[0];
    const response = await fetch(`/api/uploadBlob?filename=${file.name}`, {
      method: "POST",
      body: file,
    });
    const newBlob = (await response.json()) as PutBlobResult;

    setImageUrl(newBlob.url);
  };

  // Todo: List out images already uploaded in Store. Allow user to select from those images and just then just fired setImageUrl with that previously uploaded image

  return (
    <div className={"flex justify-between"}>
      <input ref={inputFileRef} type="file" required />
      <Button type="button" variant={"outline"} onClick={() => uploadImage()}>
        Upload
      </Button>
      {imageUrl && (
        <div className="flex h-full w-full flex-1 justify-center ">
          <Image
            src={imageUrl}
            alt="image"
            width={250}
            height={250}
            className=" object-cover object-center"
          />
        </div>
      )}
    </div>
  );
}
