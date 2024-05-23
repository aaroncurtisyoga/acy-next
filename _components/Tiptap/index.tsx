"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Link } from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Toolbar from "@/_components/Tiptap/Toolbar";

type TiptapProps = {
  description: string;
  errorMessage?: string;
  onChange: (richText: string) => void;
};

const Tiptap = ({ onChange, errorMessage }: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { HTMLAttributes: { class: "list-disc pl-4" } },
        orderedList: { HTMLAttributes: { class: "list-decimal pl-4" } },
      }),
      Link,
      Underline,
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "rounded-md border min-h-[200px] border-gray-300 p-4 ProseMirror focus:outline-none focus:ring-2 focus:border-transparent",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      {errorMessage && (
        <p className={"text-tiny text-danger p-1"}>{errorMessage}</p>
      )}
    </div>
  );
};

export default Tiptap;
