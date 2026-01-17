"use client";

import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Divider } from "@heroui/divider";
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
  Undo2,
  Redo2,
} from "lucide-react";
import { useState, memo } from "react";
import LinkDialog from "./LinkDialog";

interface ToolbarProps {
  editor: Editor | null;
  isDisabled?: boolean;
}

// Helper to format keyboard shortcuts for display
const formatShortcut = (mac: string, win: string) => {
  const isMac =
    typeof navigator !== "undefined" &&
    navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  return isMac ? mac : win;
};

const Toolbar = memo(({ editor, isDisabled = false }: ToolbarProps) => {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);

  if (!editor) {
    return null;
  }

  const openLinkDialog = () => {
    setIsLinkDialogOpen(true);
  };

  const handleLinkSubmit = (url: string, openInNewTab: boolean) => {
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({
          href: url,
          target: openInNewTab ? "_blank" : null,
        })
        .run();
    }
  };

  const handleLinkRemove = () => {
    editor.chain().focus().unsetLink().run();
  };

  const currentLinkUrl = editor.getAttributes("link").href || "";

  return (
    <>
      <div className="flex flex-wrap gap-1 p-3 mb-2 border-default-200 border rounded-medium bg-default-50">
        {/* Undo/Redo */}
        <Tooltip content={`Undo (${formatShortcut("⌘Z", "Ctrl+Z")})`}>
          <Button
            isIconOnly
            type="button"
            onPress={() => editor.chain().focus().undo().run()}
            isDisabled={isDisabled || !editor.can().undo()}
            size="sm"
            variant="light"
            aria-label="Undo"
          >
            <Undo2 size={18} />
          </Button>
        </Tooltip>

        <Tooltip content={`Redo (${formatShortcut("⇧⌘Z", "Ctrl+Y")})`}>
          <Button
            isIconOnly
            type="button"
            onPress={() => editor.chain().focus().redo().run()}
            isDisabled={isDisabled || !editor.can().redo()}
            size="sm"
            variant="light"
            aria-label="Redo"
          >
            <Redo2 size={18} />
          </Button>
        </Tooltip>

        <Divider orientation="vertical" className="mx-1 h-6 my-auto" />

        {/* Text formatting */}
        <Tooltip content={`Bold (${formatShortcut("⌘B", "Ctrl+B")})`}>
          <Button
            isIconOnly
            type="button"
            onPress={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "bg-default-200" : ""}
            isDisabled={isDisabled}
            size="sm"
            variant="light"
            aria-label="Bold"
          >
            <Bold size={18} />
          </Button>
        </Tooltip>

        <Tooltip content={`Italic (${formatShortcut("⌘I", "Ctrl+I")})`}>
          <Button
            isIconOnly
            type="button"
            onPress={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "bg-default-200" : ""}
            isDisabled={isDisabled}
            size="sm"
            variant="light"
            aria-label="Italic"
          >
            <Italic size={18} />
          </Button>
        </Tooltip>

        <Tooltip content={`Underline (${formatShortcut("⌘U", "Ctrl+U")})`}>
          <Button
            isIconOnly
            type="button"
            onPress={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive("underline") ? "bg-default-200" : ""}
            isDisabled={isDisabled}
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
            isDisabled={isDisabled}
            size="sm"
            variant="light"
            aria-label="Strikethrough"
          >
            <Strikethrough size={18} />
          </Button>
        </Tooltip>

        <Divider orientation="vertical" className="mx-1 h-6 my-auto" />

        {/* Headings */}
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
            isDisabled={isDisabled}
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
            isDisabled={isDisabled}
            size="sm"
            variant="light"
            aria-label="Heading 2"
          >
            <Heading2 size={18} />
          </Button>
        </Tooltip>

        <Divider orientation="vertical" className="mx-1 h-6 my-auto" />

        {/* Lists */}
        <Tooltip content="Bullet List">
          <Button
            isIconOnly
            type="button"
            onPress={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "bg-default-200" : ""}
            isDisabled={isDisabled}
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
            isDisabled={isDisabled}
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
            isDisabled={isDisabled}
            size="sm"
            variant="light"
            aria-label="Blockquote"
          >
            <MessageSquareQuote size={18} />
          </Button>
        </Tooltip>

        <Divider orientation="vertical" className="mx-1 h-6 my-auto" />

        {/* Link */}
        <Tooltip
          content={`${editor.isActive("link") ? "Edit" : "Add"} Link (${formatShortcut("⌘K", "Ctrl+K")})`}
        >
          <Button
            isIconOnly
            type="button"
            onPress={openLinkDialog}
            className={editor.isActive("link") ? "bg-default-200" : ""}
            isDisabled={isDisabled}
            size="sm"
            variant="light"
            aria-label={editor.isActive("link") ? "Edit Link" : "Add Link"}
          >
            <LinkIcon size={18} />
          </Button>
        </Tooltip>

        {/* Horizontal Rule */}
        <Tooltip content="Horizontal Rule">
          <Button
            isIconOnly
            type="button"
            onPress={() => editor.chain().focus().setHorizontalRule().run()}
            isDisabled={isDisabled}
            size="sm"
            variant="light"
            aria-label="Horizontal Rule"
          >
            <Minus size={18} />
          </Button>
        </Tooltip>
      </div>

      <LinkDialog
        isOpen={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
        onSubmit={handleLinkSubmit}
        onRemove={handleLinkRemove}
        initialUrl={currentLinkUrl}
        hasExistingLink={editor.isActive("link")}
      />
    </>
  );
});

Toolbar.displayName = "Toolbar";

export default Toolbar;
