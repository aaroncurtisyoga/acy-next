"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-text";
import { Paragraph } from "@tiptap/extension-paragraph";
import { BulletList } from "@tiptap/extension-bullet-list";
import { OrderedList } from "@tiptap/extension-ordered-list";

import { Bold, Italic } from "lucide-react";

const RichTextEditor = () => {
  const editor = useEditor({
    extensions: [StarterKit, Highlight, Paragraph, BulletList, OrderedList],
    content: "<p>Hello World! 🌎️</p>",
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
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;

{
  /*<button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
        >
          Bullet List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        >
          Numbered List
        </button>*/
}
{
  /*<button
          onClick={() => editor.chain().focus().indent().run()}
          className={editor.isActive("indent") ? "is-active" : ""}
        >
          Indentation Right
        </button>
        <button
          onClick={() => editor.chain().focus().outdent().run()}
          className={editor.isActive("outdent") ? "is-active" : ""}
        >
          Indentation Left
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          Text align left
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          Text align center
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          Text align right
        </button>*/
}
