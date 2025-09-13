"use client";

import { Link } from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useCallback, memo } from "react";
import styles from "@/app/_components/Tiptap/index.module.css";
import Toolbar from "@/app/_components/Tiptap/Toolbar";

interface TiptapProps {
  description?: string;
  placeholder?: string;
  errorMessage?: string;
  onChange: (richText: string) => void;
  initialContent?: string;
}

const Tiptap = memo(
  ({
    description,
    placeholder = "Start typing...",
    errorMessage,
    onChange,
    initialContent = "",
  }: TiptapProps) => {
    const handleUpdate = useCallback(
      ({ editor }: { editor: any }) => {
        const html = editor.getHTML();
        onChange(html);
      },
      [onChange],
    );

    const editor = useEditor({
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      extensions: [
        StarterKit.configure({
          underline: false, // Disable built-in underline to use our custom one
          bulletList: {
            HTMLAttributes: { class: "list-disc pl-4 my-2" },
            keepMarks: true,
            keepAttributes: false,
          },
          orderedList: {
            HTMLAttributes: { class: "list-decimal pl-4 my-2" },
            keepMarks: true,
            keepAttributes: false,
          },
          heading: {
            levels: [1, 2, 3],
            HTMLAttributes: {
              class: "font-bold",
            },
          },
          paragraph: {
            HTMLAttributes: {
              class: "my-2",
            },
          },
          blockquote: {
            HTMLAttributes: {
              class: "border-l-4 border-default-300 pl-4 italic my-2",
            },
          },
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: "text-primary underline cursor-pointer",
          },
          validate: (href) => /^https?:\/\//.test(href),
        }),
        Underline,
        Placeholder.configure({
          placeholder,
          emptyEditorClass: "is-editor-empty",
        }),
      ],
      content: initialContent,
      editorProps: {
        attributes: {
          class: `${styles.tiptap} rounded-md border min-h-[200px] border-default-200 p-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent prose prose-sm max-w-none`,
        },
      },
      onUpdate: handleUpdate,
      autofocus: false,
      editable: true,
    });

    useEffect(() => {
      if (!editor) return;

      const currentContent = editor.getHTML();
      if (
        initialContent &&
        initialContent !== currentContent &&
        initialContent !== "<p></p>"
      ) {
        editor.commands.setContent(initialContent, { emitUpdate: false });
      }
    }, [initialContent, editor]);

    useEffect(() => {
      return () => {
        editor?.destroy();
      };
    }, [editor]);

    if (!editor) {
      return (
        <div className="min-h-[200px] rounded-md border border-default-200 p-4" />
      );
    }

    return (
      <div className={styles.editorContainer}>
        {description && <div className={styles.description}>{description}</div>}
        <Toolbar editor={editor} />
        <EditorContent editor={editor} />
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      </div>
    );
  },
);

Tiptap.displayName = "Tiptap";

export default Tiptap;
