"use client";

import { Button } from "@/components/ui/button";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";
import { Separator } from "@/components/ui/separator";
import { useEditorState, type Editor } from "@tiptap/react";
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
    typeof navigator !== "undefined" && /Mac/i.test(navigator.userAgent);
  return isMac ? mac : win;
};

const Toolbar = memo(({ editor, isDisabled = false }: ToolbarProps) => {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);

  // Subscribe to editor transactions so active/enabled states stay fresh —
  // the editor is created with shouldRerenderOnTransaction: false
  const state = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) return null;
      return {
        canUndo: ctx.editor.can().undo(),
        canRedo: ctx.editor.can().redo(),
        isBold: ctx.editor.isActive("bold"),
        isItalic: ctx.editor.isActive("italic"),
        isUnderline: ctx.editor.isActive("underline"),
        isStrike: ctx.editor.isActive("strike"),
        isHeading1: ctx.editor.isActive("heading", { level: 1 }),
        isHeading2: ctx.editor.isActive("heading", { level: 2 }),
        isBulletList: ctx.editor.isActive("bulletList"),
        isOrderedList: ctx.editor.isActive("orderedList"),
        isBlockquote: ctx.editor.isActive("blockquote"),
        isLink: ctx.editor.isActive("link"),
        linkHref: ctx.editor.getAttributes("link").href || "",
        linkOpensInNewTab: ctx.editor.getAttributes("link").target === "_blank",
      };
    },
  });

  if (!editor || !state) {
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

  return (
    <>
      <div className="flex flex-wrap gap-1 p-3 mb-2 border-border border rounded-md bg-muted/50">
        {/* Undo/Redo */}
        <SimpleTooltip content={`Undo (${formatShortcut("⌘Z", "Ctrl+Z")})`}>
          <Button
            size="icon"
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={isDisabled || !state.canUndo}
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
            disabled={isDisabled || !state.canRedo}
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
            className={`h-8 w-8 ${state.isBold ? "bg-accent" : ""}`}
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
            className={`h-8 w-8 ${state.isItalic ? "bg-accent" : ""}`}
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
            className={`h-8 w-8 ${state.isUnderline ? "bg-accent" : ""}`}
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
            className={`h-8 w-8 ${state.isStrike ? "bg-accent" : ""}`}
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
            className={`h-8 w-8 ${state.isHeading1 ? "bg-accent" : ""}`}
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
            className={`h-8 w-8 ${state.isHeading2 ? "bg-accent" : ""}`}
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
            className={`h-8 w-8 ${state.isBulletList ? "bg-accent" : ""}`}
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
            className={`h-8 w-8 ${state.isOrderedList ? "bg-accent" : ""}`}
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
            className={`h-8 w-8 ${state.isBlockquote ? "bg-accent" : ""}`}
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
          content={`${state.isLink ? "Edit" : "Add"} Link (${formatShortcut("⌘K", "Ctrl+K")})`}
        >
          <Button
            size="icon"
            type="button"
            onClick={openLinkDialog}
            className={`h-8 w-8 ${state.isLink ? "bg-accent" : ""}`}
            disabled={isDisabled}
            variant="ghost"
            aria-label={state.isLink ? "Edit Link" : "Add Link"}
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
        initialUrl={state.linkHref}
        initialOpenInNewTab={state.isLink ? state.linkOpensInNewTab : true}
        hasExistingLink={state.isLink}
      />
    </>
  );
});

Toolbar.displayName = "Toolbar";

export default Toolbar;
