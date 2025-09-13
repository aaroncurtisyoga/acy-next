"use client";

import { Button, Tooltip, Divider } from "@heroui/react";
import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Link as LinkIcon,
  List,
  ListOrdered,
  MessageSquareQuote,
  Minus,
  Strikethrough,
  Underline,
  Link2Off,
} from "lucide-react";
import { useCallback, memo } from "react";

interface ToolbarProps {
  editor: Editor | null;
}

const Toolbar = memo(({ editor }: ToolbarProps) => {
  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 p-3 mb-2 border-default-200 border rounded-medium bg-default-50">
      <Tooltip content="Bold">
        <Button
          isIconOnly
          type="button"
          onPress={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-default-200" : ""}
          size="sm"
          variant="light"
          aria-label="Bold"
        >
          <Bold size={18} />
        </Button>
      </Tooltip>

      <Tooltip content="Italic">
        <Button
          isIconOnly
          type="button"
          onPress={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-default-200" : ""}
          size="sm"
          variant="light"
          aria-label="Italic"
        >
          <Italic size={18} />
        </Button>
      </Tooltip>

      <Tooltip content="Underline">
        <Button
          isIconOnly
          type="button"
          onPress={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "bg-default-200" : ""}
          size="sm"
          variant="light"
          aria-label="Underline"
        >
          <Underline size={18} />
        </Button>
      </Tooltip>

      <Tooltip content="Strikethrough">
        <Button
          isIconOnly
          type="button"
          onPress={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "bg-default-200" : ""}
          size="sm"
          variant="light"
          aria-label="Strikethrough"
        >
          <Strikethrough size={18} />
        </Button>
      </Tooltip>

      <Divider orientation="vertical" className="mx-1 h-6 my-auto" />

      <Tooltip content="Heading 1">
        <Button
          isIconOnly
          type="button"
          onPress={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "bg-default-200" : ""
          }
          size="sm"
          variant="light"
          aria-label="Heading 1"
        >
          <Heading1 size={18} />
        </Button>
      </Tooltip>

      <Tooltip content="Heading 2">
        <Button
          isIconOnly
          type="button"
          onPress={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "bg-default-200" : ""
          }
          size="sm"
          variant="light"
          aria-label="Heading 2"
        >
          <Heading2 size={18} />
        </Button>
      </Tooltip>

      <Divider orientation="vertical" className="mx-1 h-6 my-auto" />

      <Tooltip content="Bullet List">
        <Button
          isIconOnly
          type="button"
          onPress={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-default-200" : ""}
          size="sm"
          variant="light"
          aria-label="Bullet List"
        >
          <List size={18} />
        </Button>
      </Tooltip>

      <Tooltip content="Numbered List">
        <Button
          isIconOnly
          type="button"
          onPress={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-default-200" : ""}
          size="sm"
          variant="light"
          aria-label="Numbered List"
        >
          <ListOrdered size={18} />
        </Button>
      </Tooltip>

      <Tooltip content="Blockquote">
        <Button
          isIconOnly
          type="button"
          onPress={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "bg-default-200" : ""}
          size="sm"
          variant="light"
          aria-label="Blockquote"
        >
          <MessageSquareQuote size={18} />
        </Button>
      </Tooltip>

      <Divider orientation="vertical" className="mx-1 h-6 my-auto" />

      <Tooltip content="Add Link">
        <Button
          isIconOnly
          type="button"
          onPress={setLink}
          className={editor.isActive("link") ? "bg-default-200" : ""}
          size="sm"
          variant="light"
          aria-label="Add Link"
        >
          <LinkIcon size={18} />
        </Button>
      </Tooltip>

      {editor.isActive("link") && (
        <Tooltip content="Remove Link">
          <Button
            isIconOnly
            type="button"
            onPress={() => editor.chain().focus().unsetLink().run()}
            size="sm"
            variant="light"
            aria-label="Remove Link"
          >
            <Link2Off size={18} />
          </Button>
        </Tooltip>
      )}

      <Tooltip content="Horizontal Rule">
        <Button
          isIconOnly
          type="button"
          onPress={() => editor.chain().focus().setHorizontalRule().run()}
          size="sm"
          variant="light"
          aria-label="Horizontal Rule"
        >
          <Minus size={18} />
        </Button>
      </Tooltip>
    </div>
  );
});

Toolbar.displayName = "Toolbar";

export default Toolbar;
