"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
} from "lucide-react";
import { PaginationPlus } from "tiptap-pagination-plus";
import { Button } from "./button";

interface LetterConfig {
  id: number;
  letter_category_id: number;
  name: string;
  price: number;
  thumbnail: string;
  thumbnail_back: string;
  thumbnail_original: string;
  top_padding: number;
  context_width: number;
  context_height: number;
  context_line_height: number;
  max_line: number;
  sort_order: number;
  is_active: boolean;
  count: number;
  tags: string | null;
  created_at: string;
  updated_at: string;
}

interface LetterTiptapEditorProps {
  config: LetterConfig;
  initialContent?: string;
  onUpdate?: (content: object) => void;
  showToolbar?: boolean;
}

const LetterTiptapEditor = ({
  config,
  initialContent = "",
  onUpdate,
  showToolbar = true,
}: LetterTiptapEditorProps) => {
  const { context_line_height, max_line, top_padding } = config;
  
  // Calculate page height based on config
  const pageHeight = (max_line * context_line_height) + (top_padding * 2);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // Remove heading functionality if needed
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      PaginationPlus.configure({
        pageHeight: pageHeight,
        pageGap: 20,
        pageBreakBackground: "transparent",
        pageHeaderHeight: 0,
        footerRight: "",
        footerLeft: "",
        headerLeft: "",
        headerRight: "",
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "prose prose-sm mx-auto focus:outline-none min-h-[200px]",
      },
    },
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getJSON());
      }
    },
  });


  if (!editor) {
    return null;
  }

  return (
    <div className="">
      {/* Toolbar - only show if requested */}
      {showToolbar && (
        <div className="sticky top-0 z-[10] mb-4">
          <div className="border rounded-lg shadow-sm p-2 bg-muted/90 flex flex-wrap gap-1 backdrop-blur-md">
            {/* Undo/Redo */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
            >
              <Redo className="h-4 w-4" />
            </Button>

            <div className="border-l mx-1" />

            {/* Text Formatting */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "bg-muted" : ""}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "bg-muted" : ""}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive("underline") ? "bg-muted" : ""}
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
            
            <div className="border-l mx-1" />

            {/* Text Alignment */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={editor.isActive({ textAlign: 'left' }) ? "bg-muted" : ""}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={editor.isActive({ textAlign: 'center' }) ? "bg-muted" : ""}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={editor.isActive({ textAlign: 'right' }) ? "bg-muted" : ""}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              className={editor.isActive({ textAlign: 'justify' }) ? "bg-muted" : ""}
            >
              <AlignJustify className="h-4 w-4" />
            </Button>

            <div className="border-l mx-1" />

            {/* Highlight */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={editor.isActive("highlight") ? "bg-muted" : ""}
            >
              <Highlighter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Editor with Repeating Letter Background */}
      <div className="letter-editor">
        <EditorContent
          editor={editor}
          className="mb-5 mx-auto"
          id="letter-tiptap-editor"
          style={{
            backgroundImage: `url(${config.thumbnail_original})`,
            backgroundSize: `372px ${pageHeight + 20}px`, // Page height + gap
            backgroundRepeat: 'repeat-y',
            backgroundPosition: 'center top',
            width: '372px',
            minHeight: `${pageHeight}px`,
            border: '1px solid #e5e5e5'
          }}
        />
      </div>
    </div>
  );
};

export default LetterTiptapEditor;