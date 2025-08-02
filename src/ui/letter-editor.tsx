"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import {
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Undo,
  Redo,
  Code,
  Heading1,
  Heading2,
  Github,
} from "lucide-react";
import ListItem from "@tiptap/extension-list-item";
import {
  PaginationPlus,
  TableCellPlus,
  TableHeaderPlus,
  TablePlus,
  TableRowPlus,
} from "tiptap-pagination-plus";
import { Button } from "./button";
import { useState, useEffect, useRef } from "react";

const config = {
  id: 3,
  letter_category_id: 9,
  name: "연보라",
  price: 1000,
  thumbnail:
    "https://dongl.s3.ap-northeast-2.amazonaws.com/letter-attachment/temp3-front.jpg",
  thumbnail_back:
    "https://dongl.s3.ap-northeast-2.amazonaws.com/letter-attachment/temp3-back.jpg",
  thumbnail_original:
    "https://dongl.s3.ap-northeast-2.amazonaws.com/letter-attachment/temp3-front.jpg",
  top_padding: 54,
  context_width: 292,
  context_height: 431,
  context_line_height: 23,
  max_line: 18,
  sort_order: 0,
  is_active: true,
  count: 0,
  tags: null,
  created_at: "2025-07-27T02:45:30.998Z",
  updated_at: "2025-07-27T02:45:30.998Z",
};

//500 700
// 370 518
// pt 54 pb
// 32

const topPadding = 52;
const lineHeight = 23.1;
const TiptapEditor = () => {
  const [containerHeight, setContainerHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  // Calculate pagination values
  const pageHeight = config.max_line * lineHeight + topPadding * 2;
  const pageGap = 20;
  const totalPageHeight = pageHeight + pageGap;
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      TablePlus,
      TableRowPlus,
      TableCellPlus,
      TableHeaderPlus,
      ListItem,
      PaginationPlus.configure({
        pageHeight: pageHeight,
        pageGap: pageGap,
        pageBreakBackground: "transparent",
        pageHeaderHeight: topPadding,
        headerLeft: "sr-only",
      }),
    ],
    content: undefined,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] px-10",
      },
    },
    onUpdate: ({ editor }) => {
      console.log(editor.getJSON());
    },
  });

  // Watch container height and calculate number of pages needed
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const observer = new ResizeObserver((entries) => {
      // Debounce to prevent infinite loops from zoom changes
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        for (const entry of entries) {
          // Get the actual content height, accounting for zoom
          const height = entry.contentRect.height;
          setContainerHeight(height);
        }
      }, 100);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  // Calculate how many background pages we need
  const numberOfPages = Math.ceil(containerHeight / totalPageHeight) + 1; // Add 1 for safety

  if (!editor) {
    return null;
  }

  return (
    <div className="">
      <div className="sticky top-0 z-[10] pt-8">
        <div className="w-full mb-1 flex flex-row gap-2 justify-between">
          <div className="inline-flex flex-row gap-2">
            <a
              href="https://github.com/RomikMakavana/tiptap-pagination"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="sm" className="!bg-black">
                <Github className="h-4 w-4 text-white" />
              </Button>
            </a>
            <iframe
              src="https://github.com/sponsors/RomikMakavana/button"
              title="Sponsor RomikMakavana"
              height="32"
              width="114"
              style={{ border: "0", borderRadius: "6px" }}
            ></iframe>
          </div>
          <a
            href="https://www.buymeacoffee.com/romikmakavana"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
              alt="Buy Me A Coffee"
              style={{ height: "35px", width: "132px" }}
            />
          </a>
        </div>
        <div className="border rounded-lg shadow-sm p-2 bg-muted/90 flex flex-wrap gap-1 backdrop-blur-md">
          <div className="flex flex-wrap gap-0.5">
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

            {/* Table Controls */}
            <div className="border-l mx-1" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={
                editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""
              }
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={
                editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""
              }
            >
              <Heading2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="border-l mx-1" />
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "bg-muted" : ""}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={editor.isActive("code") ? "bg-muted" : ""}
          >
            <Code className="h-4 w-4" />
          </Button>
          <div className="border-l mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "bg-muted" : ""}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "bg-muted" : ""}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="letter-zoom-wrapper w-[370px] mx-auto">
        <div
          className="editor-container relative overflow-hidden"
          id="editor-container"
          ref={containerRef}
        >
          {/* Absolute positioned background container */}
          <div
            className="absolute inset-0 pointer-events-none z-0 size-full overflow-visibl flex flex-col"
            style={{ width: "370px", margin: "0 auto", gap: 20 }}
          >
            {Array.from({ length: numberOfPages }, (_, index) => (
              <div
                key={index}
                style={{
                  width: "370px",
                  height: `${pageHeight}px`,
                  backgroundImage: `url(${config.thumbnail_original})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center top",
                  flexShrink: 0,
                }}
              />
            ))}
          </div>

          {/* Editor content */}
          <EditorContent
            editor={editor}
            className="w-full mb-5 mx-auto relative z-10"
            id="editor"
          />
        </div>
      </div>
    </div>
  );
};

export default TiptapEditor;
