"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { forwardRef, useCallback } from "react";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import FontFamily from "@tiptap/extension-font-family";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";
import { common, createLowlight } from "lowlight";

const lowlight = createLowlight(common);

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt("Image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addTable = useCallback(() => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-gray-200 p-2 bg-gray-50 flex flex-wrap gap-1">
      {/* Font Family */}
      <select
        onChange={(e) =>
          editor.chain().focus().setFontFamily(e.target.value).run()
        }
        value={editor.getAttributes("textStyle").fontFamily}
        className="px-2 py-1 border rounded text-sm bg-white"
      >
        <option value="Inter">Inter</option>
        <option value="Arial">Arial</option>
        <option value="Georgia">Georgia</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Courier New">Courier New</option>
      </select>

      {/* Font Size */}
      <select
        onChange={(e) => {
          editor.chain().focus().setFontSize(e.target.value).run();
        }}
        className="px-2 py-1 border rounded text-sm bg-white"
      >
        <option value="12px">12px</option>
        <option value="14px">14px</option>
        <option value="16px">16px</option>
        <option value="18px">18px</option>
        <option value="20px">20px</option>
        <option value="24px">24px</option>
        <option value="30px">30px</option>
        <option value="36px">36px</option>
      </select>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Headers */}
      <select
        onChange={(e) => {
          const level = parseInt(e.target.value);
          if (level === 0) {
            editor.chain().focus().setParagraph().run();
          } else {
            editor.chain().focus().toggleHeading({ level }).run();
          }
        }}
        className="px-2 py-1 border rounded text-sm bg-white"
        value={
          editor.isActive("heading", { level: 1 })
            ? 1
            : editor.isActive("heading", { level: 2 })
            ? 2
            : editor.isActive("heading", { level: 3 })
            ? 3
            : editor.isActive("heading", { level: 4 })
            ? 4
            : editor.isActive("heading", { level: 5 })
            ? 5
            : editor.isActive("heading", { level: 6 })
            ? 6
            : 0
        }
      >
        <option value={0}>Normal</option>
        <option value={1}>Heading 1</option>
        <option value={2}>Heading 2</option>
        <option value={3}>Heading 3</option>
        <option value={4}>Heading 4</option>
        <option value={5}>Heading 5</option>
        <option value={6}>Heading 6</option>
      </select>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Text formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2 py-1 border rounded text-sm font-bold hover:bg-gray-100 ${
          editor.isActive("bold") ? "bg-blue-100 text-blue-700" : ""
        }`}
        title="Bold"
      >
        B
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2 py-1 border rounded text-sm italic hover:bg-gray-100 ${
          editor.isActive("italic") ? "bg-blue-100 text-blue-700" : ""
        }`}
        title="Italic"
      >
        I
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`px-2 py-1 border rounded text-sm underline hover:bg-gray-100 ${
          editor.isActive("underline") ? "bg-blue-100 text-blue-700" : ""
        }`}
        title="Underline"
      >
        U
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`px-2 py-1 border rounded text-sm line-through hover:bg-gray-100 ${
          editor.isActive("strike") ? "bg-blue-100 text-blue-700" : ""
        }`}
        title="Strikethrough"
      >
        S
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Colors */}
      <input
        type="color"
        onInput={(event) =>
          editor
            .chain()
            .focus()
            .setColor((event.target as HTMLInputElement).value)
            .run()
        }
        value={editor.getAttributes("textStyle").color || "#000000"}
        className="w-8 h-6 border rounded cursor-pointer"
        title="Text Color"
      />
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`px-2 py-1 border rounded text-sm hover:bg-gray-100 ${
          editor.isActive("highlight") ? "bg-yellow-200" : ""
        }`}
        title="Highlight"
      >
        🖍
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Alignment */}
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`px-2 py-1 border rounded text-sm hover:bg-gray-100 ${
          editor.isActive({ textAlign: "left" })
            ? "bg-blue-100 text-blue-700"
            : ""
        }`}
        title="Align Left"
      >
        ⬅
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`px-2 py-1 border rounded text-sm hover:bg-gray-100 ${
          editor.isActive({ textAlign: "center" })
            ? "bg-blue-100 text-blue-700"
            : ""
        }`}
        title="Center"
      >
        ⬌
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`px-2 py-1 border rounded text-sm hover:bg-gray-100 ${
          editor.isActive({ textAlign: "right" })
            ? "bg-blue-100 text-blue-700"
            : ""
        }`}
        title="Align Right"
      >
        ➡
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 border rounded text-sm hover:bg-gray-100 ${
          editor.isActive("bulletList") ? "bg-blue-100 text-blue-700" : ""
        }`}
        title="Bullet List"
      >
        •
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-2 py-1 border rounded text-sm hover:bg-gray-100 ${
          editor.isActive("orderedList") ? "bg-blue-100 text-blue-700" : ""
        }`}
        title="Numbered List"
      >
        1.
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Quote & Code */}
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`px-2 py-1 border rounded text-sm hover:bg-gray-100 ${
          editor.isActive("blockquote") ? "bg-blue-100 text-blue-700" : ""
        }`}
        title="Quote"
      >
        &quot;
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`px-2 py-1 border rounded text-sm hover:bg-gray-100 ${
          editor.isActive("codeBlock") ? "bg-blue-100 text-blue-700" : ""
        }`}
        title="Code Block"
      >
        {"</>"}
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Link & Image */}
      <button
        onClick={setLink}
        className={`px-2 py-1 border rounded text-sm hover:bg-gray-100 ${
          editor.isActive("link") ? "bg-blue-100 text-blue-700" : ""
        }`}
        title="Link"
      >
        🔗
      </button>
      <button
        onClick={addImage}
        className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
        title="Image"
      >
        🖼
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Subscript & Superscript */}
      <button
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        className={`px-2 py-1 border rounded text-sm hover:bg-gray-100 ${
          editor.isActive("subscript") ? "bg-blue-100 text-blue-700" : ""
        }`}
        title="Subscript"
      >
        x₂
      </button>
      <button
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        className={`px-2 py-1 border rounded text-sm hover:bg-gray-100 ${
          editor.isActive("superscript") ? "bg-blue-100 text-blue-700" : ""
        }`}
        title="Superscript"
      >
        x²
      </button>

      {/* Table Controls */}
      <div className="flex gap-1">
        <button
          onClick={addTable}
          className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
          title="Insert Table"
        >
          Table
        </button>
        {editor.isActive("table") && (
          <>
            <button
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
              title="Add Column Before"
            >
              ←|
            </button>
            <button
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
              title="Add Column After"
            >
              |→
            </button>
            <button
              onClick={() => editor.chain().focus().addRowBefore().run()}
              className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
              title="Add Row Before"
            >
              ↑_
            </button>
            <button
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
              title="Add Row After"
            >
              _↓
            </button>
            <button
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
              title="Delete Column"
            >
              ❌|
            </button>
            <button
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
              title="Delete Row"
            >
              ❌_
            </button>
            <button
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
              title="Delete Table"
            >
              ❌📋
            </button>
          </>
        )}
      </div>

      {/* Task List */}
      <button
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={`px-2 py-1 border rounded text-sm hover:bg-gray-100 ${
          editor.isActive("taskList") ? "bg-blue-100 text-blue-700" : ""
        }`}
        title="Task List"
      >
        ☑
      </button>

      {/* Undo/Redo */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="px-2 py-1 border rounded text-sm hover:bg-gray-100 disabled:opacity-50"
        title="Undo"
      >
        ↶
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="px-2 py-1 border rounded text-sm hover:bg-gray-100 disabled:opacity-50"
        title="Redo"
      >
        ↷
      </button>
    </div>
  );
};

const Editor = forwardRef<HTMLDivElement, EditorProps>(
  ({ value, onChange, placeholder = "Write something..." }, ref) => {
    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          codeBlock: false,
        }),
        Underline,
        TextStyle,
        Color,
        FontFamily,
        Highlight.configure({ multicolor: true }),
        TextAlign.configure({
          types: ["heading", "paragraph", "table"],
        }),
        Link.configure({
          openOnClick: false,
        }),
        Image,
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
        CodeBlockLowlight.configure({
          lowlight: lowlight,
        }),
        Subscript,
        Superscript,
        TaskList,
        TaskItem.configure({
          nested: true,
        }),
        Placeholder.configure({
          placeholder: placeholder,
        }),
      ],
      content: value,
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
      editorProps: {
        attributes: {
          class:
            "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[350px] p-4",
        },
      },
    });

    return (
      <div
        className="border border-gray-300 rounded-lg overflow-hidden bg-white min-h-[400px]"
        ref={ref}
      >
        <MenuBar editor={editor} />
        <div className="relative">
          <EditorContent editor={editor} className="min-h-[350px]" />
          {editor?.isEmpty && (
            <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
              {placeholder}
            </div>
          )}
        </div>

        <style jsx global>{`
          .ProseMirror {
            outline: none !important;
            padding: 1rem;
            min-height: 350px;
            font-size: 16px;
            line-height: 1.5;
          }

          .ProseMirror h1 {
            font-size: 2em;
            font-weight: bold;
            margin: 0.5em 0;
          }

          .ProseMirror h2 {
            font-size: 1.5em;
            font-weight: bold;
            margin: 0.5em 0;
          }

          .ProseMirror h3 {
            font-size: 1.25em;
            font-weight: bold;
            margin: 0.5em 0;
          }

          .ProseMirror ul,
          .ProseMirror ol {
            padding-left: 1.5rem;
          }

          .ProseMirror blockquote {
            border-left: 4px solid #e5e7eb;
            padding-left: 1rem;
            margin: 1rem 0;
            font-style: italic;
          }

          .ProseMirror pre {
            background: #f3f4f6;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
          }

          .ProseMirror img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
          }

          .ProseMirror a {
            color: #3b82f6;
            text-decoration: underline;
          }

          /* Table styles */
          .ProseMirror table {
            border-collapse: collapse;
            margin: 0;
            overflow: hidden;
            table-layout: fixed;
            width: 100%;
          }

          .ProseMirror td,
          .ProseMirror th {
            border: 2px solid #ced4da;
            box-sizing: border-box;
            min-width: 1em;
            padding: 3px 5px;
            position: relative;
            vertical-align: top;
          }

          .ProseMirror th {
            background-color: #f8f9fa;
            font-weight: bold;
            text-align: left;
          }

          .ProseMirror .selectedCell:after {
            background: rgba(200, 200, 255, 0.4);
            content: "";
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            pointer-events: none;
            position: absolute;
            z-index: 2;
          }

          /* Task list styles */
          .ProseMirror ul[data-type="taskList"] {
            list-style: none;
            padding: 0;
          }

          .ProseMirror ul[data-type="taskList"] li {
            display: flex;
            align-items: flex-start;
            margin-bottom: 0.5em;
          }

          .ProseMirror ul[data-type="taskList"] li > label {
            margin-right: 0.5em;
            user-select: none;
          }

          .ProseMirror ul[data-type="taskList"] li > div {
            flex: 1;
          }

          /* Code block styles */
          .ProseMirror pre {
            background: #0d0d0d;
            border-radius: 0.5rem;
            color: #fff;
            font-family: "JetBrainsMono", monospace;
            padding: 0.75rem 1rem;
          }

          .ProseMirror pre code {
            background: none;
            color: inherit;
            font-size: 0.8rem;
            padding: 0;
          }

          .ProseMirror pre .hljs-comment,
          .ProseMirror pre .hljs-quote {
            color: #616161;
          }

          .ProseMirror pre .hljs-variable,
          .ProseMirror pre .hljs-template-variable,
          .ProseMirror pre .hljs-attribute,
          .ProseMirror pre .hljs-tag,
          .ProseMirror pre .hljs-name,
          .ProseMirror pre .hljs-regexp,
          .ProseMirror pre .hljs-link,
          .ProseMirror pre .hljs-name,
          .ProseMirror pre .hljs-selector-id,
          .ProseMirror pre .hljs-selector-class {
            color: #f98181;
          }

          .ProseMirror pre .hljs-number,
          .ProseMirror pre .hljs-meta,
          .ProseMirror pre .hljs-built_in,
          .ProseMirror pre .hljs-builtin-name,
          .ProseMirror pre .hljs-literal,
          .ProseMirror pre .hljs-type,
          .ProseMirror pre .hljs-params {
            color: #fbbc88;
          }

          .ProseMirror pre .hljs-string,
          .ProseMirror pre .hljs-symbol,
          .ProseMirror pre .hljs-bullet {
            color: #b9f18d;
          }

          .ProseMirror pre .hljs-title,
          .ProseMirror pre .hljs-section {
            color: #faf594;
          }

          .ProseMirror pre .hljs-keyword,
          .ProseMirror pre .hljs-selector-tag {
            color: #70cff8;
          }

          .ProseMirror pre .hljs-emphasis {
            font-style: italic;
          }

          .ProseMirror pre .hljs-strong {
            font-weight: 700;
          }
        `}</style>
      </div>
    );
  }
);

Editor.displayName = "TiptapEditor";

export default Editor;
