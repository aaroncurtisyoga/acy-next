import { type Editor } from "@tiptap/react";
import {
  Bold,
  Strikethrough,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Heading2,
} from "lucide-react";

type ToolbarProps = {
  editor: Editor;
};
const Toolbar = ({ editor }: ToolbarProps) => {
  return (
    <div className="font-inter text-gray-600">
      <div className="flex gap-4 p-4 border-b border-gray-300 menu">
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
        >
          <Heading2 />
        </button>
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
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          <Strikethrough />
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
  );
};

export default Toolbar;
