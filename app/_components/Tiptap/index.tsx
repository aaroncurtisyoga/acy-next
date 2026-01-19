"use client";

import { Link } from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import CharacterCount from "@tiptap/extension-character-count";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useCallback, useMemo, memo } from "react";
import DOMPurify from "dompurify";
import styles from "@/app/_components/Tiptap/index.module.css";
import Toolbar from "@/app/_components/Tiptap/Toolbar";

interface TiptapProps {
  description?: string;
  placeholder?: string;
  errorMessage?: string;
  onChange: (richText: string) => void;
  initialContent?: string;
  isDisabled?: boolean;
  maxLength?: number;
  showCharacterCount?: boolean;
}

const Tiptap = memo(
  ({
    description,
    placeholder = "Start typing...",
    errorMessage,
    onChange,
    initialContent = "",
    isDisabled = false,
    maxLength,
    showCharacterCount = true,
  }: TiptapProps) => {
    const handleUpdate = useCallback(
      ({ editor }: { editor: any }) => {
        const html = editor.getHTML();
        // Sanitize HTML before passing to parent
        const sanitizedHtml =
          typeof window !== "undefined" ? DOMPurify.sanitize(html) : html;
        onChange(sanitizedHtml);
      },
      [onChange],
    );

    // Memoize extensions to prevent duplicate registration warnings
    const extensions = useMemo(
      () => [
        StarterKit.configure({
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
            target: "_blank",
            rel: "noopener noreferrer",
          },
          validate: (href) => /^https?:\/\//.test(href),
        }),
        Underline,
        Placeholder.configure({
          placeholder,
          emptyEditorClass: "is-editor-empty",
        }),
        CharacterCount.configure({
          limit: maxLength,
        }),
      ],
      [placeholder, maxLength],
    );

    const editor = useEditor({
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      extensions,
      content: initialContent,
      editorProps: {
        attributes: {
          class: `${styles.tiptap} rounded-md border min-h-[200px] border-default-200 p-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent prose prose-sm max-w-none ${
            errorMessage ? styles.hasError : ""
          } ${isDisabled ? styles.disabled : ""}`,
        },
        editable: () => !isDisabled,
      },
      onUpdate: handleUpdate,
      autofocus: false,
      editable: !isDisabled,
    });

    // Sync editable state when isDisabled changes
    useEffect(() => {
      if (editor) {
        editor.setEditable(!isDisabled);
      }
    }, [editor, isDisabled]);

    // Sync initial content
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

    const characterCount = editor?.storage.characterCount.characters() ?? 0;
    const wordCount = editor?.storage.characterCount.words() ?? 0;

    if (!editor) {
      return (
        <div
          className={`min-h-[200px] rounded-md border border-default-200 p-4 ${styles.editorContainer}`}
        />
      );
    }

    return (
      <div className={styles.editorContainer}>
        {description && <div className={styles.description}>{description}</div>}
        <Toolbar editor={editor} isDisabled={isDisabled} />
        <EditorContent editor={editor} />
        <div className={styles.footer}>
          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}
          {showCharacterCount && (
            <div className={styles.characterCount}>
              {wordCount} {wordCount === 1 ? "word" : "words"}
              {maxLength && (
                <span
                  className={
                    characterCount > maxLength ? styles.overLimit : undefined
                  }
                >
                  {" "}
                  · {characterCount}/{maxLength} characters
                </span>
              )}
              {!maxLength && <span> · {characterCount} characters</span>}
            </div>
          )}
        </div>
      </div>
    );
  },
);

Tiptap.displayName = "Tiptap";

export default Tiptap;
