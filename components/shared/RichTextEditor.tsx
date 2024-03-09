"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import Highlight from "@tiptap/extension-text";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { BulletList } from "@tiptap/extension-bullet-list";
import { Extension } from "@tiptap/core";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { Paragraph } from "@tiptap/extension-paragraph";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  IndentDecrease,
  IndentIncrease,
  Italic,
  List,
  ListOrdered,
} from "lucide-react";

const Indent = Extension.create({
  name: "indent",

  addCommands() {
    return {
      indent: ({ chain }) => {
        return chain()
          .focus()
          .command(({ tr, selection }) => {
            tr.forEachNodeAt(selection.getRanges(), (node, pos) => {
              if (node.type.name === "paragraph") {
                tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  style: "padding-left: 40px;",
                });
              }
            });
            return true;
          })
          .run();
      },
      outdent: ({ chain }) => {
        return chain()
          .focus()
          .command(({ tr, selection }) => {
            tr.forEachNodeAt(selection.getRanges(), (node, pos) => {
              if (node.type.name === "paragraph") {
                tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  style: "padding-left: 0px;",
                });
              }
            });
            return true;
          })
          .run();
      },
    };
  },
});

const RichTextEditor = () => {
  const editor = useEditor({
    extensions: [
      BulletList,
      Highlight,
      Indent,
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
      <div className="rich-text-editor menu">
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
          onClick={() => editor.chain().focus().indent().run()}
          className={editor.isActive("indent") ? "is-active" : ""}
        >
          <IndentIncrease />
        </button>
        <button
          onClick={() => editor.chain().focus().outdent().run()}
          className={editor.isActive("outdent") ? "is-active" : ""}
        >
          <IndentDecrease />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
