"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface DescriptionProps {
  description: string;
}
const Description = ({ description }: DescriptionProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: description,
    editable: false,
  });

  return (
    <>
      <h2 className={"text-2xl font-bold mb-3"}>About this event</h2>
      <EditorContent editor={editor} />
    </>
  );
};

export default Description;
