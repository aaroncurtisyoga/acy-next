"use client";

import { Button } from "@/components/ui/button";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";
import { Separator } from "@/components/ui/separator";
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
      <div className="flex flex-wrap gap-1 p-3 mb-2 border-border border rounded-md bg-muted/50">
        {/* Undo/Redo */}
        <SimpleTooltip content={`Undo (${formatShortcut("⌘Z", "Ctrl+Z")})`}>
          <Button
            size="icon"
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={isDisabled || !editor.can().undo()}
            variant="ghost"
            className="h-8 w-8"
            aria-label="Undo"
          >
            <Undo2 size={18} />
          </Button>
        </SimpleTooltip>

        <SimpleTooltip content={`Redo (${formatShortcut("⇧⌘Z", "Ctrl+Y")})`}>
          <Button
            size="icon"
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={isDisabled || !editor.can().redo()}
            variant="ghost"
            className="h-8 w-8"
            aria-label="Redo"
          >
            <Redo2 size={18} />
          </Button>
        </SimpleTooltip>

        <Separator orientation="vertical" className="mx-1 h-6 my-auto" />

        {/* Text formatting */}
        <SimpleTooltip content={`Bold (${formatShortcut("⌘B", "Ctrl+B")})`}>
          <Button
            size="icon"
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`h-8 w-8 ${editor.isActive("bold") ? "bg-accent" : ""}`}
            disabled={isDisabled}
            variant="ghost"
            aria-label="Bold"
          >
            <Bold size={18} />
          </Button>
        </SimpleTooltip>

        <SimpleTooltip content={`Italic (${formatShortcut("⌘I", "Ctrl+I")})`}>
          <Button
            size="icon"
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`h-8 w-8 ${editor.isActive("italic") ? "bg-accent" : ""}`}
            disabled={isDisabled}
            variant="ghost"
            aria-label="Italic"
          >
            <Italic size={18} />
          </Button>
        </SimpleTooltip>

        <SimpleTooltip
          content={`Underline (${formatShortcut("⌘U", "Ctrl+U")})`}
        >
          <Button
            size="icon"
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`h-8 w-8 ${editor.isActive("underline") ? "bg-accent" : ""}`}
            disabled={isDisabled}
            variant="ghost"
            aria-label="Underline"
          >
            <Underline size={18} />
          </Button>
        </SimpleTooltip>

        <SimpleTooltip content="Strikethrough">
          <Button
            size="icon"
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`h-8 w-8 ${editor.isActive("strike") ? "bg-accent" : ""}`}
            disabled={isDisabled}
            variant="ghost"
            aria-label="Strikethrough"
          >
            <Strikethrough size={18} />
          </Button>
        </SimpleTooltip>

        <Separator orientation="vertical" className="mx-1 h-6 my-auto" />

        {/* Headings */}
        <SimpleTooltip content="Heading 1">
          <Button
            size="icon"
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`h-8 w-8 ${editor.isActive("heading", { level: 1 }) ? "bg-accent" : ""}`}
            disabled={isDisabled}
            variant="ghost"
            aria-label="Heading 1"
          >
            <Heading1 size={18} />
          </Button>
        </SimpleTooltip>

        <SimpleTooltip content="Heading 2">
          <Button
            size="icon"
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`h-8 w-8 ${editor.isActive("heading", { level: 2 }) ? "bg-accent" : ""}`}
            disabled={isDisabled}
            variant="ghost"
            aria-label="Heading 2"
          >
            <Heading2 size={18} />
          </Button>
        </SimpleTooltip>

        <Separator orientation="vertical" className="mx-1 h-6 my-auto" />

        {/* Lists */}
        <SimpleTooltip content="Bullet List">
          <Button
            size="icon"
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`h-8 w-8 ${editor.isActive("bulletList") ? "bg-accent" : ""}`}
            disabled={isDisabled}
            variant="ghost"
            aria-label="Bullet List"
          >
            <List size={18} />
          </Button>
        </SimpleTooltip>

        <SimpleTooltip content="Numbered List">
          <Button
            size="icon"
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`h-8 w-8 ${editor.isActive("orderedList") ? "bg-accent" : ""}`}
            disabled={isDisabled}
            variant="ghost"
            aria-label="Numbered List"
          >
            <ListOrdered size={18} />
          </Button>
        </SimpleTooltip>

        <SimpleTooltip content="Blockquote">
          <Button
            size="icon"
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`h-8 w-8 ${editor.isActive("blockquote") ? "bg-accent" : ""}`}
            disabled={isDisabled}
            variant="ghost"
            aria-label="Blockquote"
          >
            <MessageSquareQuote size={18} />
          </Button>
        </SimpleTooltip>

        <Separator orientation="vertical" className="mx-1 h-6 my-auto" />

        {/* Link */}
        <SimpleTooltip
          content={`${editor.isActive("link") ? "Edit" : "Add"} Link (${formatShortcut("⌘K", "Ctrl+K")})`}
        >
          <Button
            size="icon"
            type="button"
            onClick={openLinkDialog}
            className={`h-8 w-8 ${editor.isActive("link") ? "bg-accent" : ""}`}
            disabled={isDisabled}
            variant="ghost"
            aria-label={editor.isActive("link") ? "Edit Link" : "Add Link"}
          >
            <LinkIcon size={18} />
          </Button>
        </SimpleTooltip>

        {/* Horizontal Rule */}
        <SimpleTooltip content="Horizontal Rule">
          <Button
            size="icon"
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            disabled={isDisabled}
            variant="ghost"
            className="h-8 w-8"
            aria-label="Horizontal Rule"
          >
            <Minus size={18} />
          </Button>
        </SimpleTooltip>
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
