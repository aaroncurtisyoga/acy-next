"use client";

import { CharacterCount, Placeholder } from "@tiptap/extensions";
import {
  useEditor,
  useEditorState,
  EditorContent,
  Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useCallback, useMemo, useRef, memo } from "react";
import DOMPurify from "dompurify";
import { isRichTextEmpty } from "@/app/_components/Tiptap/RichTextContent";
import {
  looksLikeHtmlSource,
  stripCodeFence,
} from "@/app/_components/Tiptap/paste-html";
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
  onEditorReady?: (editor: Editor) => void;
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
    onEditorReady,
  }: TiptapProps) => {
    // Referenced from handlePaste (which is created before `editor` exists);
    // populated once the editor is ready, below.
    const editorRef = useRef<Editor | null>(null);

    const handleUpdate = useCallback(
      ({ editor }: { editor: Editor }) => {
        const html = editor.getHTML();
        // Sanitize HTML before passing to parent. DOMPurify strips `target`
        // by default; keep it so "open in new tab" survives (links always
        // carry rel="noopener noreferrer")
        const sanitizedHtml =
          typeof window !== "undefined"
            ? DOMPurify.sanitize(html, { ADD_ATTR: ["target"] })
            : html;
        onChange(sanitizedHtml);
      },
      [onChange],
    );

    const extensions = useMemo(
      () => [
        // StarterKit v3 already includes Link and Underline — configure
        // Link here rather than registering it twice
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
              class: "border-l-4 border-border pl-4 italic my-2",
            },
          },
          link: {
            openOnClick: false,
            HTMLAttributes: {
              class: "text-primary underline cursor-pointer",
              target: "_blank",
              rel: "noopener noreferrer",
            },
            shouldAutoLink: (url) => /^https?:\/\//i.test(url),
          },
        }),
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
          class: `${styles.tiptap} rounded-md border min-h-[200px] border-input p-4 focus:outline-none focus:ring-1 focus:ring-ring ${
            errorMessage ? styles.hasError : ""
          } ${isDisabled ? styles.disabled : ""}`,
        },
        // Render pasted HTML *source* (e.g. AI-generated markup copied as text)
        // as formatted content instead of literal tags. Skipped inside code
        // blocks so raw HTML can still be pasted as code when that's intended.
        handlePaste: (_view, event) => {
          const activeEditor = editorRef.current;
          if (!activeEditor || activeEditor.isActive("codeBlock")) return false;

          const source = stripCodeFence(
            event.clipboardData?.getData("text/plain") ?? "",
          );
          if (!looksLikeHtmlSource(source)) return false;

          // Parse through the schema (drops anything unsupported) after a
          // DOMPurify pass, matching the sanitization used in handleUpdate.
          const clean =
            typeof window !== "undefined"
              ? DOMPurify.sanitize(source, { ADD_ATTR: ["target"] })
              : source;
          activeEditor.commands.insertContent(clean);
          return true;
        },
      },
      onUpdate: handleUpdate,
      autofocus: false,
      editable: !isDisabled,
    });

    const counts = useEditorState({
      editor,
      selector: (ctx) => ({
        characters: ctx.editor?.storage.characterCount.characters() ?? 0,
        words: ctx.editor?.storage.characterCount.words() ?? 0,
      }),
    });

    // Sync editable state when isDisabled changes. emitUpdate: false —
    // otherwise this fires onChange on mount and dirties a pristine form
    useEffect(() => {
      if (editor) {
        editor.setEditable(!isDisabled, false);
      }
    }, [editor, isDisabled]);

    // Expose the editor instance to parents that need programmatic access,
    // and to handlePaste via editorRef.
    useEffect(() => {
      if (editor) {
        editorRef.current = editor;
        onEditorReady?.(editor);
      }
    }, [editor, onEditorReady]);

    // Sync externally-changed content; skip while the user is typing so a
    // round-tripped form value can't reset the cursor
    useEffect(() => {
      if (!editor || editor.isFocused) return;

      const currentContent = editor.getHTML();
      if (
        !isRichTextEmpty(initialContent) &&
        initialContent !== currentContent
      ) {
        editor.commands.setContent(initialContent, { emitUpdate: false });
      }
    }, [initialContent, editor]);

    const characterCount = counts?.characters ?? 0;
    const wordCount = counts?.words ?? 0;

    if (!editor) {
      return (
        <div
          className={`min-h-[200px] rounded-md border border-input p-4 ${styles.editorContainer}`}
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
