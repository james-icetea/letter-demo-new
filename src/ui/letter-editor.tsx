"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useState, useEffect, useLayoutEffect, useMemo } from "react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { FontSize } from "@/extensions/FontSizeExtension";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Smile,
  Highlighter,
  Palette,
} from "lucide-react";
import { PaginationPlus } from "../extensions/PaginationExtension";
import { Button } from "./button";
import {
  EmptyPlaceholderExtension,
  EmptyPlaceholderNode,
} from "@/extensions/EmptyPlaceholderExtension";
import { UndoRedo } from "@/extensions/UndoRedo";
import { EmojiPicker } from "./emoji-picker";

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

  // Store editor content to persist across recreations
  const [editorContent, setEditorContent] = useState<any>({
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "1",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "1",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "1",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "1",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "1",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "1",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "1",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "1",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "1",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "1",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "1",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "1",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "1",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "1",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "1",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "1",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "1",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "1",
          },
        ],
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
        content: [
          {
            type: "text",
            text: "1233123",
          },
        ],
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
        content: [
          {
            type: "text",
            text: "123",
          },
        ],
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
        content: [
          {
            type: "text",
            text: "313",
          },
        ],
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
      {
        type: "emptyPlaceholder",
      },
    ],
  });

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
        StarterKit.configure({
          history: false,
        }),
        Underline,
        TextStyle,
        Color,
        Highlight.configure({
          multicolor: true,
        }),
        FontSize,
        EmptyPlaceholderNode,
        EmptyPlaceholderExtension.configure({
          linesPerPage: config.max_line,
          initialPages: 1,
          lineHeight: config.context_line_height * currentZoom,
          minLinesPerPage: 1,
        }),
        PaginationPlus.configure(editorConfig),
        UndoRedo,
      ],
      content: editorContent,
      editorProps: {
        attributes: {
          class: "mx-auto focus:outline-none",
        },
      },
      onUpdate: ({ editor }) => {
        console.log("Editor updated:", editor.getJSON());
        // Store content to persist across recreations
        setEditorContent(editor.getJSON());

        // Count actual page footers to get exact page count
        const pageFooters = editor.view.dom.querySelectorAll(".rm-page-break");
        const pageCount = pageFooters.length;
        setNumberOfPages(pageCount ?? 0);
        console.log(editor.getJSON());
      },
    },
    [editorConfig]
  );

  // This is a fallback for initial render
  const [numberOfPages, setNumberOfPages] = useState(1);

  // Debug editor for normalize functionality
  const debugEditor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          history: false,
        }),
        Underline,
        TextStyle,
        Color,
        Highlight.configure({
          multicolor: true,
        }),
        FontSize,
        EmptyPlaceholderNode,
        EmptyPlaceholderExtension.configure({
          linesPerPage: config.max_line,
          initialPages: 1,
          lineHeight: config.context_line_height * currentZoom,
          minLinesPerPage: 1,
        }),
        PaginationPlus.configure(editorConfig),
        UndoRedo,
      ],
      content: undefined,
      editorProps: {
        attributes: {
          class: "mx-auto focus:outline-none",
        },
      },
    },
    [editorConfig]
  );

  // Helper function to extract text content from any node
  const extractTextFromNode = (node: any): string => {
    if (!node) return "";

    if (node.type === "text") {
      return node.text || "";
    }

    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractTextFromNode).join("");
    }

    return "";
  };

  // Optimized normalize pages function
  const normalizePage = async () => {
    if (!editor || !debugEditor) {
      console.warn("Editors not available for normalization");
      return { content: [], openEnd: 0 };
    }

    const doc = editor.state.doc;
    const docSize = doc.content.size;
    console.log(docSize);
    if (docSize === 0) {
      return { content: "[]", from: 0, to: 0 };
    }

    const pages: Array<{ from: number; to: number; content: string }> = [];
    const targetPageHeight = editorConfig.pageHeight;

    let start = 0;
    const maxIterations = docSize * 2; // Safety limit to prevent infinite loops
    let iterationCount = 0;

    // Semaphore to prevent overlapping getContentHeight calls
    let isHeightMeasuring = false;

    // Helper function to safely get content height without caching
    const getContentHeight = async (
      fromPos: number,
      toPos: number
    ): Promise<number> => {
      // Wait if another measurement is in progress to prevent overlapping
      while (isHeightMeasuring) {
        await new Promise((resolve) => setTimeout(resolve, 2));
      }

      isHeightMeasuring = true;

      try {
        // Strict boundary validation to prevent node type errors
        if (fromPos < 0 || toPos > docSize || fromPos >= toPos) {
          return 0;
        }
        // Ensure positions are valid node boundaries
        const validFromPos = Math.max(0, Math.min(fromPos, docSize));
        const validToPos = Math.max(validFromPos, Math.min(toPos, docSize));

        if (validFromPos === validToPos) {
          return 0;
        }

        // Extract the actual document slice and convert to JSON
        const slice = doc.slice(validFromPos, validToPos);
        const sliceJson = slice.toJSON();

        if (sliceJson && sliceJson.content) {
          // Batch DOM updates to avoid excessive reflows
          debugEditor.commands.setContent({
            type: "doc",
            content: sliceJson.content,
          });
          
          // Only focus if not already focused (avoid redundant DOM operations)
          if (!debugEditor.isFocused) {
            debugEditor.commands.focus();
          }

          // Wait for DOM to fully update and render using requestAnimationFrame
          const height = await new Promise<number>((resolve) => {
            requestAnimationFrame(() => {
              // Second RAF to ensure DOM is fully painted
              requestAnimationFrame(() => {
                // Force a reflow to ensure measurement is accurate
                void debugEditor.view.dom.offsetHeight;
                const measuredHeight = debugEditor.view.dom.offsetHeight;
                console.log(
                  `Measured height for range ${validFromPos}-${validToPos}:`,
                  measuredHeight
                );
                resolve(measuredHeight);
              });
            });
          });

          return height;
        }
      } catch (error) {
        console.error("Error in getContentHeight:", error);
      } finally {
        isHeightMeasuring = false;
      }

      return 0;
    };

    // Optimized jump-forward algorithm to find page break point
    const findPageBreak = async (startPos: number): Promise<number> => {
      const startTime = performance.now();
      // First check if remaining content from startPos to docSize fits in one page
      if (startPos < docSize) {
        const remainingHeight = await getContentHeight(startPos, docSize);
        if (remainingHeight > 0 && remainingHeight <= targetPageHeight + 5) {
          // Remaining content fits in target height, make it the last page
          return docSize;
        }
      }

      // Start with a larger jump for faster traversal
      let currentEnd = startPos + 1;
      const jumpSize = 15; // Increased from 7 to 15 for faster scanning
      let lastGoodEnd = startPos + 1;

      // Phase 1: Jump forward by 15 until we overflow
      while (currentEnd < docSize && iterationCount < maxIterations) {
        iterationCount++;

        // Early exit optimization: if remaining content is very small, assume it fits
        const remainingNodes = docSize - currentEnd;
        if (remainingNodes <= 3) {
          lastGoodEnd = Math.min(currentEnd + remainingNodes, docSize);
          break;
        }

        const height = await getContentHeight(startPos, currentEnd);
        if (height === 0) {
          // If we can't measure, move forward conservatively
          currentEnd++;
          continue;
        }

        if (height <= targetPageHeight + 5) {
          // Content fits, save this position and jump forward
          lastGoodEnd = currentEnd;
          currentEnd += jumpSize;
        } else {
          // Content overflows, break and start stepping back
          break;
        }
      }

      // Phase 2: Step back from overflow point to find optimal break
      let stepBackEnd = Math.min(currentEnd, docSize);

      // Step back one by one from the overflow point
      while (stepBackEnd > lastGoodEnd && iterationCount < maxIterations) {
        iterationCount++;
        stepBackEnd--;

        const height = await getContentHeight(startPos, stepBackEnd);
        if (height === 0) {
          continue;
        }

        if (height <= targetPageHeight + 5) {
          // Found the optimal break point
          return stepBackEnd;
        }
      }

      // Fallback to the last known good position
      const result =
        lastGoodEnd > startPos ? lastGoodEnd : Math.min(startPos + 1, docSize);
      const endTime = performance.now();
      console.log(
        `findPageBreak(${startPos} -> ${result}) took ${(
          endTime - startTime
        ).toFixed(2)}ms`
      );
      return result;
    };

    while (start < docSize && iterationCount < maxIterations) {
      const pageEnd = await findPageBreak(start);

      try {
        // Get text content for this page range
        const textContent = doc.textBetween(start, pageEnd);

        pages.push({
          from: start,
          to: pageEnd,
          content: textContent, // Store text string
        });
      } catch (error) {
        console.warn(
          `Error extracting text content for range ${start}-${pageEnd}:`,
          error
        );
      }

      start = pageEnd;
    }

    // Filter out empty pages (check if content array has meaningful content)
    const nonEmptyPages = pages.filter((page) => {
      return !!page.content.trim();
    });

    const normalizedContent = {
      type: "doc",
      content: nonEmptyPages.reduce((prev, cur) => {
        const slice = editor.state.doc.slice(cur.from, cur.to);
        const sliceJson = slice.toJSON();
        return prev.concat(sliceJson.content);
      }, []),
    };
    console.log(docSize);
    console.log("Total pages found:", pages);
    console.log("Non-empty pages:", nonEmptyPages);
    console.log(
      "Normalized content:",
      nonEmptyPages.map((cur) => {
        const slice = editor.state.doc.slice(cur.from, cur.to);
        const sliceJson = slice.toJSON();
        return sliceJson;
      }, [])
    );
    try {
      editor.commands.setContent({
        type: "doc",
        content: normalizedContent.content,
      });

      editor.commands.focus();
    } catch (error) {
      console.error("Error setting normalized content:", error);
    }
  };

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

          <div className="border-l mx-1" />

          {/* Highlight Color Picker */}
          <div className="relative">
            <input
              type="color"
              onChange={(e) =>
                editor
                  .chain()
                  .focus()
                  .setHighlight({ color: e.target.value })
                  .run()
              }
              className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
              title="Highlight Color"
              defaultValue="#ffff00"
            />
            <Highlighter className="h-4 w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().unsetHighlight().run()}
            title="Remove Highlight"
          >
            Remove Highlight
          </Button>

          {/* Text Color Picker */}
          <div className="relative">
            <input
              type="color"
              onChange={(e) =>
                editor.chain().focus().setColor(e.target.value).run()
              }
              className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
              title="Text Color"
              defaultValue="#000000"
            />
            <Palette className="h-4 w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().unsetColor().run()}
            title="Remove Text Color"
          >
            Reset Color
          </Button>

          {/* Font Size Selector */}
          <select
            onChange={(e) => {
              if (e.target.value === "normal") {
                editor.chain().focus().unsetFontSize().run();
              } else {
                editor.chain().focus().setFontSize(e.target.value).run();
              }
            }}
            className="px-2 py-1 text-sm border rounded"
            title="Font Size"
          >
            <option value="xsmall">8.8px</option>
            <option value="small">10.8px</option>
            <option value="normal" selected>
              12.8px
            </option>
            <option value="large">14.8px</option>
          </select>

          <EmojiPicker
            onChange={(emoji) =>
              editor.chain().focus().insertContent(emoji).run()
            }
          >
            <Button variant="ghost" size="sm" title="Insert Emoji">
              <Smile className="h-4 w-4" />
            </Button>
          </EmojiPicker>

          <Button
            variant="ghost"
            size="sm"
            title="Add Page"
            onClick={() => editor.commands.addEmptyPage()}
          >
            + page
          </Button>

          <Button
            variant="ghost"
            size="sm"
            title="Normalize Pages"
            onClick={() => {
              normalizePage().catch(console.error);
            }}
          >
            Normalize
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
          className="w-full mx-auto editor-container"
          style={{
            paddingInline: config.inline_padding * currentZoom,
          }}
        />

        <EditorContent
          editor={debugEditor}
          id="e"
          className="w-full mx-auto editor-container"
          style={{
            marginTop: editorConfig.pageGap,
            paddingInline: config.inline_padding * currentZoom,
          }}
        />
      </div>
    </div>
  );
};

export default TiptapEditor;
