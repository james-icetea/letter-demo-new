"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useState, useEffect, useLayoutEffect, useMemo } from "react";
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
import { PaginationPlus } from "../extensions/PaginationExtension";
import { Button } from "./button";

// Zoom breakpoints interface
interface ZoomBreakpoints {
  [pixels: number]: number;
}

// Props interface
interface TiptapEditorProps {
  zoom?: number | ZoomBreakpoints;
}

const config = {
  thumbnail_original:
    "https://dongl.co.kr/assets/upload/onebon_1742830602_007070_0.jpeg",
  top_padding: 54,
  inline_padding: 44,
  context_width: 292,
  context_height: 431,
  context_line_height: 24,
  max_line: 18,
  height: 777,
};

const mul = 5 / 7;

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  zoom = { 1280: 1.5, 1024: 1.4, 768: 1.2, 640: 1.0 },
}) => {
  // Zoom state
  const [currentZoom, setCurrentZoom] = useState(1);

  // Update zoom on window resize with throttling
  useLayoutEffect(() => {
    // Calculate zoom based on screen width and zoom config
    const calculateZoom = (): number => {
      if (typeof zoom === "number") {
        return zoom;
      }

      const width = window.innerWidth;
      const breakpoints = Object.keys(zoom)
        .map(Number)
        .sort((a, b) => b - a); // Sort descending

      for (const breakpoint of breakpoints) {
        if (width >= breakpoint) {
          return zoom[breakpoint];
        }
      }

      // Fallback to smallest breakpoint value
      const smallestBreakpoint = Math.min(...breakpoints);
      return zoom[smallestBreakpoint] || 1;
    };

    const updateZoom = () => {
      setCurrentZoom(calculateZoom());
    };

    // Throttle function to limit resize event frequency
    let throttleTimer: NodeJS.Timeout | null = null;
    const throttledUpdateZoom = () => {
      if (throttleTimer) return;

      throttleTimer = setTimeout(() => {
        updateZoom();
        throttleTimer = null;
      }, 100); // 100ms throttle
    };

    updateZoom(); // Initial calculation
    window.addEventListener("resize", throttledUpdateZoom);
    return () => {
      window.removeEventListener("resize", throttledUpdateZoom);
      if (throttleTimer) {
        clearTimeout(throttleTimer);
      }
    };
  }, [zoom]);

  const editorConfig = useMemo(() => {
    const basePageWidth = 385;
    const basePageGap = 20;
    const pageWidth = basePageWidth * currentZoom;
    const pageHeight = pageWidth / mul;
    const pageGap = basePageGap * currentZoom;
    const pageHeaderHeight = config.top_padding * currentZoom;
    return {
      pageWidth,
      pageHeight,
      pageGap,
      pageBreakBackground: "transparent",
      pageHeaderHeight,
      pageFooterHeight:
        pageHeight -
        pageHeaderHeight -
        config.max_line * config.context_line_height * currentZoom,
      headerLeft: "sr-only",
    };
  }, [currentZoom]);
  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Underline,
        TextStyle,
        Color,
        PaginationPlus.configure(editorConfig),
      ],
      content:
        "<p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p><p>1</p>",
      editorProps: {
        attributes: {
          class: "mx-auto focus:outline-none",
        },
      },
      onUpdate: ({ editor }) => {
        console.log(editor.getJSON());
      },
    },
    [editorConfig]
  );

  // This is a fallback for initial render
  const [numberOfPages, setNumberOfPages] = useState(1);

  // Update background pages when editor content changes
  useEffect(() => {
    if (editor) {
      const updatePageCount = () => {
        // Count actual page footers to get exact page count
        const pageFooters = editor.view.dom.querySelectorAll(".rm-page-footer");
        const pageCount = pageFooters.length;
        setNumberOfPages(pageCount ?? 0);
      };

      // Listen for both content updates and pagination updates
      editor.on("update", updatePageCount);
      editor.on("transaction", updatePageCount);
      updatePageCount(); // Initial count

      return () => {
        editor.off("update", updatePageCount);
        editor.off("transaction", updatePageCount);
      };
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div>
      <div className="sticky controls top-0 z-[10] pt-8">
        <div className="border rounded-lg shadow-sm p-2 bg-muted/90 flex flex-wrap gap-1 backdrop-blur-md">
          <Button variant="ghost" size="sm">
            {numberOfPages} pages
          </Button>
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

          <Button variant="ghost" size="sm" title="Add Page">
            + page
          </Button>
        </div>
      </div>
      <div
        className="mx-auto editor-container relative overflow-hidden sheet"
        style={
          {
            width: editorConfig.pageWidth,
            "--zoom-scale": currentZoom,
          } as React.CSSProperties & { "--zoom-scale": number }
        }
        id="editor-container"
      >
        <div
          className="w-full absolute image-container inset-0 pointer-events-none z-0 size-full overflow-visibl flex flex-col"
          style={{ margin: "0 auto", gap: editorConfig.pageGap }}
        >
          {Array.from({ length: numberOfPages }, (_, index) => (
            <div
              key={index}
              className="image-bg"
              style={{
                width: "100%",
                height: editorConfig.pageHeight,
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
            paddingInline: config.inline_padding * currentZoom,
          }}
        />
      </div>
    </div>
  );
};

export default TiptapEditor;
