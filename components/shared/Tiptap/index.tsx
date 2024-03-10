"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Link } from "@tiptap/extension-link";
import { Heading } from "@tiptap/extension-heading";
import Toolbar from "@/components/shared/Tiptap/Toolbar";
type RichTextEditorProps = {
  description: string;
  onChange: (richText: string) => void;
};

const RichTextEditor = ({ description, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      Heading.configure({
        HTMLAttributes: { class: "text-xl font-bold" },
      }),
      Link.configure(),
    ],
    content: description,
    editorProps: {
      attributes: {
        class:
          "rounded-md border min-h-[200px] border-gray-300 p-4 ProseMirror",
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
    </div>
  );
};

export default RichTextEditor;
