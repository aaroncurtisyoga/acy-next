"use client";

import { memo, useMemo, useState } from "react";
import { Smile } from "lucide-react";
import type { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SimpleTooltip } from "@/components/ui/simple-tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EMOJI_GROUPS, type EmojiEntry } from "./emoji-data";

interface EmojiPickerProps {
  editor: Editor;
  isDisabled?: boolean;
}

const EmojiButton = ({
  entry,
  onSelect,
}: {
  entry: EmojiEntry;
  onSelect: (char: string) => void;
}) => (
  <button
    type="button"
    // No focus() on insert: keeping DOM focus inside the popover leaves it open
    // so several emoji can be added in a row. onMouseDown-preventDefault keeps
    // the editor's selection from collapsing before we insert at the cursor.
    onMouseDown={(e) => e.preventDefault()}
    onClick={() => onSelect(entry.char)}
    title={entry.name}
    aria-label={entry.name}
    className="flex h-8 w-8 items-center justify-center rounded text-xl leading-none hover:bg-accent focus:bg-accent focus:outline-none"
  >
    {entry.char}
  </button>
);

const EmojiPicker = memo(({ editor, isDisabled = false }: EmojiPickerProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return null;
    const seen = new Set<string>();
    const matches: EmojiEntry[] = [];
    for (const group of EMOJI_GROUPS) {
      for (const entry of group.emojis) {
        if (seen.has(entry.char)) continue;
        if (
          entry.name.toLowerCase().includes(q) ||
          entry.keywords.toLowerCase().includes(q)
        ) {
          seen.add(entry.char);
          matches.push(entry);
        }
      }
    }
    return matches;
  }, [q]);

  const insertEmoji = (char: string) => {
    // Insert at the editor's preserved selection without stealing focus, so
    // the popover stays open. Emoji are plain text, so the sanitize step in
    // the Tiptap onUpdate handler leaves them intact.
    editor.chain().insertContent(char).run();
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setQuery("");
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <SimpleTooltip content="Emoji">
        <PopoverTrigger asChild>
          <Button
            size="icon"
            type="button"
            variant="ghost"
            className={`h-8 w-8 ${open ? "bg-accent" : ""}`}
            disabled={isDisabled}
            aria-label="Insert emoji"
          >
            <Smile size={18} />
          </Button>
        </PopoverTrigger>
      </SimpleTooltip>

      <PopoverContent
        align="start"
        className="w-80 p-0"
        // Return the caret to the editor when the picker closes rather than
        // parking focus on the trigger button.
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          editor.commands.focus();
        }}
      >
        <div className="border-b p-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search emoji…"
            className="h-8"
            autoFocus
          />
        </div>

        <div className="max-h-64 overflow-y-auto p-2">
          {results ? (
            results.length > 0 ? (
              <div className="grid grid-cols-8 gap-0.5">
                {results.map((entry) => (
                  <EmojiButton
                    key={entry.char}
                    entry={entry}
                    onSelect={insertEmoji}
                  />
                ))}
              </div>
            ) : (
              <p className="px-1 py-6 text-center text-sm text-muted-foreground">
                No emoji found
              </p>
            )
          ) : (
            EMOJI_GROUPS.map((group) => (
              <div key={group.id} className="mb-2 last:mb-0">
                <p className="px-1 pb-1 text-xs font-medium text-muted-foreground">
                  {group.label}
                </p>
                <div className="grid grid-cols-8 gap-0.5">
                  {group.emojis.map((entry) => (
                    <EmojiButton
                      key={entry.char}
                      entry={entry}
                      onSelect={insertEmoji}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
});

EmojiPicker.displayName = "EmojiPicker";

export default EmojiPicker;
