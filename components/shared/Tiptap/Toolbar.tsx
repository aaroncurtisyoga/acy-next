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
import { Button } from "@nextui-org/react";

type ToolbarProps = {
  editor: Editor;
};
const Toolbar = ({ editor }: ToolbarProps) => {
  return (
    <div className="flex gap-4 p-4 border-gray-300 border rounded-small">
      <Button
        isIconOnly
        type={"button"}
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "bg-default-300" : ""}
        variant="light"
      >
        <Bold />
      </Button>
      <Button
        isIconOnly
        type={"button"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "bg-default-300" : ""}
        variant="light"
      >
        <Italic />
      </Button>
      <Button
        isIconOnly
        type={"button"}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "bg-default-300" : ""}
        variant="light"
      >
        <Strikethrough />
      </Button>
      <Button
        isIconOnly
        type={"button"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "bg-default-300" : ""}
        variant="light"
      >
        <List />
      </Button>
      <Button
        isIconOnly
        type={"button"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "bg-default-300" : ""}
        variant="light"
      >
        <ListOrdered />
      </Button>
      <Button
        isIconOnly
        type={"button"}
        onClick={() => {
          const url = window.prompt("URL");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={editor.isActive("link") ? "bg-default-300" : ""}
        variant="light"
      >
        <LinkIcon />
      </Button>
    </div>
  );
};

export default Toolbar;
