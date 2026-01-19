"use client";

import { FC, useMemo } from "react";
import DOMPurify from "dompurify";
import styles from "./RichTextContent.module.css";

interface RichTextContentProps {
  content: string;
  className?: string;
}

/**
 * Renders sanitized HTML content with rich text styling.
 * Use this for displaying Tiptap editor content in read-only mode.
 * More performant than creating a full Tiptap editor instance.
 */
const RichTextContent: FC<RichTextContentProps> = ({ content, className }) => {
  const sanitizedContent = useMemo(() => {
    if (typeof window === "undefined") {
      // Server-side: return content as-is (will be sanitized on client)
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
      ],
      ALLOWED_ATTR: ["href", "target", "rel", "class"],
      ADD_ATTR: ["target"], // Allow target attribute for links
    });
  }, [content]);

  if (!content || content === "<p></p>") {
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
