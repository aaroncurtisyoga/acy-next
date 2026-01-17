"use client";

import { FC } from "react";
import RichTextContent from "@/app/_components/Tiptap/RichTextContent";

interface DescriptionProps {
  description: string;
}

const DescriptionDisplay: FC<DescriptionProps> = ({ description }) => {
  if (!description || description === "<p></p>") {
    return null;
  }

  return (
    <div className="mb-6 md:mb-8">
      <h2 className="text-2xl font-bold mb-3">About this event</h2>
      <RichTextContent content={description} />
    </div>
  );
};

export default DescriptionDisplay;
