"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useState, useEffect } from "react";
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
  Plus,
} from "lucide-react";
import {
  TableCellPlus,
  TableHeaderPlus,
  TablePlus,
  TableRowPlus,
} from "tiptap-pagination-plus";
import { PaginationPlus } from "../extensions/PaginationExtension";
import { Button } from "./button";

// Custom hook for media query
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
};

// const config = {
//   id: 3,
//   letter_category_id: 9,
//   name: "연보라",
//   price: 1000,
//   thumbnail:
//     "https://dongl.s3.ap-northeast-2.amazonaws.com/letter-attachment/temp3-front.jpg",
//   thumbnail_back:
//     "https://dongl.s3.ap-northeast-2.amazonaws.com/letter-attachment/temp3-back.jpg",
//   thumbnail_original:
//     "https://dongl.s3.ap-northeast-2.amazonaws.com/letter-attachment/temp3-front.jpg",
//   top_padding: 54,
//   context_width: 292,
//   context_height: 431,
//   context_line_height: 23.1,
//   max_line: 18,
//   sort_order: 0,
//   is_active: true,
//   count: 0,
//   tags: null,
//   created_at: "2025-07-27T02:45:30.998Z",
//   updated_at: "2025-07-27T02:45:30.998Z",
// };

const config = {
  thumbnail_original:
    "https://dongl.co.kr/assets/upload/onebon_1742830602_007070_0.jpeg",
  top_padding: 54,
  inline_padding: 40,
  context_width: 292,
  context_height: 431,
  context_line_height: 24,
  max_line: 18,
  height: 777,
};
//500 700
// 370 518
// pt 54 pb
// 32

// Use exact values from config to avoid calculation mismatches
const mul = 5 / 7;
const TiptapEditor = () => {
  // Calculate pagination values
  const pageWidth = 385 * 1.5;
  const pageHeight = pageWidth / mul;
  const pageGap = 20;

  // Function to add multiple pages
  const addThreePages = () => {
    // if (editor) {
    //   editor.commands.addPage();
    //   editor.commands.addPage();
    //   // editor.commands.addPage();
    // }
  };
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
      // EmptyPlaceholderExtension.configure({
      //   initialPages: 3,
      //   placeholderClass: "empty-placehoder",
      //   linesPerPage: 17,
      //   placeholderText: "",
      // }),
      PaginationPlus.configure({
        pageHeight: pageHeight,
        pageGap: pageGap * 1.5,
        pageBreakBackground: "transparent",
        pageHeaderHeight: config.top_padding * 1.5,
        pageFooterHeight:
          pageHeight -
          config.top_padding * 1.5 -
          config.max_line * config.context_line_height * 1.5, // Use same as header for now
        headerLeft: "sr-only",
      }),
    ],
    content:
      "<p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      console.log(editor.getJSON());
    },
  });

  // // Watch container height and calculate number of pages needed
  // useEffect(() => {
  //   const observer = new ResizeObserver((entries) => {
  //     for (const entry of entries) {
  //       setContainerHeight(entry.contentRect.height);
  //     }
  //   });

  //   if (containerRef.current) {
  //     observer.observe(containerRef.current);
  //   }

  //   return () => observer.disconnect();
  // }, []);

  // Calculate how many background pages we need
  const numberOfPages = 10 + 1; // Add 1 for safety

  if (!editor) {
    return null;
  }

  return (
    <div>
      <div className="sticky top-0 z-[10] pt-8">
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
          <div className="border-l mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.commands.setZoom(1.0)}
            title="Zoom 1.0"
          >
            <span className="text-xs">1.0x</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.commands.setZoom(1.5)}
            title="Zoom 1.5"
          >
            <span className="text-xs">1.5x</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.commands.setZoom(1.5)}
            title="Zoom 1.5"
          >
            <span className="text-xs">1.5x</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.commands.setZoom(2.0)}
            title="Zoom 2.0"
          >
            <span className="text-xs">2.0x</span>
          </Button>
          <div className="border-l mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.commands.addPage()}
            title="Add Page"
          >
            <Plus className="h-4 w-4" />
            <span className="ml-1 text-xs">+1</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={addThreePages}
            title="Add 3 Pages"
          >
            <Plus className="h-4 w-4" />
            <span className="ml-1 text-xs">+3</span>
          </Button>
        </div>
      </div>
      <div
        className="mx-auto editor-container relative overflow-hidden sheet"
        style={{ width: pageWidth }}
        id="editor-container"
      >
        <div
          className="w-full absolute image-container inset-0 pointer-events-none z-0 size-full overflow-visibl flex flex-col"
          style={{ margin: "0 auto", gap: 20 * 1.5 }}
        >
          {Array.from({ length: numberOfPages }, (_, index) => (
            <div
              key={index}
              className="image-bg"
              style={{
                width: "100%",
                height: pageHeight,
                backgroundImage: `url(${config.thumbnail_original})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center top",
                flexShrink: 0,
              }}
            />
          ))}
        </div>

        <EditorContent
          editor={editor}
          className="w-full mx-auto"
          id="editor"
          style={{
            paddingInline: 40 * 1.5,
          }}
        />
      </div>
    </div>
  );
};

export default TiptapEditor;
