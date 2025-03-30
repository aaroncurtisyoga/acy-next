"use client";

import { Link } from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import styles from "@/app/_components/Tiptap/index.module.css";
import Toolbar from "@/app/_components/Tiptap/Toolbar";

type TiptapProps = {
  description?: string;
  placeholder?: string;
  errorMessage?: string;
  onChange: (richText: string) => void;
  initialContent?: string;
};

const Tiptap = ({
  description,
  placeholder = "Start typing...",
  errorMessage,
  onChange,
  initialContent = "",
}: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { HTMLAttributes: { class: "list-disc pl-4" } },
        orderedList: { HTMLAttributes: { class: "list-decimal pl-4" } },
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: "font-bold",
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: `${styles.tiptap} rounded-md border min-h-[200px] border-default-200 p-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent prose max-w-none`,
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
    <div className={styles.editorContainer}>
      {description && <div className={styles.description}>{description}</div>}
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
};

export default Tiptap;
