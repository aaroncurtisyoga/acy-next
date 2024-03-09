"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import Highlight from "@tiptap/extension-text";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { BulletList } from "@tiptap/extension-bullet-list";
import { Link } from "@tiptap/extension-link";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { Paragraph } from "@tiptap/extension-paragraph";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
} from "lucide-react";

const RichTextEditor = () => {
  const editor = useEditor({
    extensions: [
      BulletList,
      Highlight,
      Link,
      OrderedList,
      Paragraph,
      StarterKit,
      TextAlign,
    ],
    content: "",
  });

  if (!editor) {
    return null;
  }

  return (
    <div>
      <div className="font-inter text-gray-600">
        <div className="flex gap-4 p-4 border-b border-gray-300 menu">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            <Bold />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
          >
            <Italic />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <AlignLeft />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <AlignCenter />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <AlignRight />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "is-active" : ""}
          >
            <List />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "is-active" : ""}
          >
            <ListOrdered />
          </button>
          <button
            onClick={() => {
              const url = window.prompt("URL");
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            className={editor.isActive("link") ? "is-active" : ""}
          >
            <LinkIcon />
          </button>
        </div>
      </div>
      <div className="p-4 min-h-[200px] border border-gray-300 rounded-md ProseMirror">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
