"use client";

import { FC, useMemo } from "react";
import DOMPurify from "dompurify";
import styles from "./RichTextContent.module.css";

interface RichTextContentProps {
  content: string;
  className?: string;
}

/**
 * True when editor HTML has no visible text — an empty editor still emits
 * markup like `<p class="my-2"></p>`, so tag-stripping beats string equality.
 */
export const isRichTextEmpty = (content: string | null | undefined): boolean =>
  !content || content.replace(/<[^>]*>/g, "").trim() === "";

/**
 * Renders sanitized HTML content with rich text styling.
 * Use this for displaying Tiptap editor content in read-only mode.
 * More performant than creating a full Tiptap editor instance.
 */
const RichTextContent: FC<RichTextContentProps> = ({ content, className }) => {
  const sanitizedContent = useMemo(() => {
    if (typeof window === "undefined") {
      // DOMPurify needs a DOM, so SSR emits the stored HTML as-is. That HTML
      // is trusted: it's admin-authored and sanitized at write time in the
      // editor. The client re-sanitizes on hydration as defense-in-depth.
      return content;
    }
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "b",
        "em",
        "i",
        "u",
        "s",
        "strike",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "ol",
        "li",
        "blockquote",
        "a",
        "code",
        "pre",
        "hr",
        "img",
      ],
      ALLOWED_ATTR: [
        "href",
        "target",
        "rel",
        "class",
        "src",
        "alt",
        "width",
        "height",
      ],
    });
  }, [content]);

  if (isRichTextEmpty(content)) {
    return null;
  }

  return (
    <div
      className={`${styles.richTextContent} ${className || ""}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default RichTextContent;
