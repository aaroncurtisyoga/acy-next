"use client";

import { FC } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
interface DescriptionProps {
  description: string;
}
const DescriptionDisplay: FC<DescriptionProps> = ({ description }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: description,
    editable: false,
  });

  return (
    <div className={"mb-6 md:mb-8"}>
      <h2 className={"text-2xl font-bold mb-3"}>About this event</h2>
      <EditorContent editor={editor} />
    </div>
  );
};

export default DescriptionDisplay;
