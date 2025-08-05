import { Extension } from "@tiptap/core";
import { Node } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
interface EmptyPlaceholderOptions {
  linesPerPage: number;
  initialPages: number;
  placeholderClass: string;
  placeholderText: string;
  lineHeight: number;
  minLinesPerPage: number;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    emptyPlaceholder: {
      initializeEmptyPages: () => ReturnType;
      addEmptyPage: () => ReturnType;
      insertEmptyLine: () => ReturnType;
    };
  }
}

// Create a custom node for empty placeholder lines
export const EmptyPlaceholderNode = Node.create({
  name: "emptyPlaceholder",

  group: "block",

  content: "text*",

  parseHTML() {
    return [
      {
        tag: "p.empty-placeholder",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["p", { class: "empty-placeholder", ...HTMLAttributes }, 0];
  },

  addCommands() {
    return {
      insertEmptyLine:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
          });
        },
    };
  },
});

export const EmptyPlaceholderExtension =
  Extension.create<EmptyPlaceholderOptions>({
    name: "EmptyPlaceholder",

    addOptions() {
      return {
        linesPerPage: 18,
        initialPages: 3,
        placeholderClass: "empty-placeholder",
        placeholderText: "",
        lineHeight: 23,
        minLinesPerPage: 1,
      };
    },


    addCommands() {
      return {
        initializeEmptyPages:
          () =>
          ({ commands, editor }) => {
            const totalLines =
              this.options.linesPerPage * this.options.initialPages;
            const content = Array(totalLines)
              .fill(null)
              .map(() => ({ type: "emptyPlaceholder" }));

            commands.setContent(content);

            // Trigger pagination update to recognize the initial pages
            setTimeout(() => {
              const tr = editor.view.state.tr.setMeta(
                "PAGE_COUNT_META_KEY",
                Date.now()
              );
              editor.view.dispatch(tr);
            }, 100);

            return true;
          },

        addEmptyPage:
          () =>
          ({ commands, editor }) => {
            // Calculate how many lines we need to add to create exactly one more page
            const calculateRequiredLines = () => {
              const editorDom = editor.view.dom;
              
              // Get current page footers to know current page count
              const pageFooters = editorDom.querySelectorAll('.rm-page-footer');
              const currentPageCount = pageFooters.length || 1;
              
              // Calculate total lines that should exist for (currentPages + 1)
              const targetPages = currentPageCount + 1;
              const totalLinesNeeded = targetPages * this.options.linesPerPage;
              
              // Count existing content lines (excluding empty placeholders)
              const contentNodes = editorDom.querySelectorAll('p:not(.empty-placeholder)');
              const emptyPlaceholders = editorDom.querySelectorAll('.empty-placeholder');
              
              const currentContentLines = contentNodes.length;
              const currentEmptyLines = emptyPlaceholders.length;
              const currentTotalLines = currentContentLines + currentEmptyLines;
              
              // Calculate how many more lines we need
              const linesToAdd = Math.max(1, totalLinesNeeded - currentTotalLines);
              
              console.log('Add page calculation:', {
                currentPageCount,
                targetPages,
                totalLinesNeeded,
                currentContentLines,
                currentEmptyLines,
                currentTotalLines,
                linesToAdd
              });
              
              return linesToAdd;
            };
            
            const requiredLines = calculateRequiredLines();
            const emptyLines = Array(requiredLines)
              .fill(null)
              .map(() => ({ type: "emptyPlaceholder" }));

            // Get the end position of the document
            const docSize = editor.state.doc.content.size;

            // Insert content at the end of the document
            commands.insertContentAt(docSize, emptyLines);

            // Trigger pagination update to recognize the new page
            setTimeout(() => {
              const tr = editor.view.state.tr.setMeta(
                "PAGE_COUNT_META_KEY",
                Date.now()
              );
              editor.view.dispatch(tr);
            }, 100);

            return true;
          },

        insertEmptyLine:
          () =>
          ({ commands }) => {
            return commands.insertContent({
              type: "emptyPlaceholder",
            });
          },
      };
    },

    onCreate() {
      // Add CSS styles for empty placeholders
      const style = document.createElement("style");
      style.dataset.emptyPlaceholderStyle = "";
      style.textContent = `
      .empty-placeholder {
        position: relative;
        cursor: text;
      }
      
      .empty-placeholder:empty::before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        height: 1px;
        background-color: #ddd;
        pointer-events: none;
      }
      
      .empty-placeholder:focus {
        opacity: 1;
      }
      
      .empty-placeholder:not(:empty) {
        opacity: 1;
      }
    `;
      document.head.appendChild(style);

      // // Automatically initialize empty pages when the extension is created
      // // Delay to ensure PaginationPlus is ready
      // setTimeout(() => {
      //   this.editor.commands.initializeEmptyPages();

      //   // Trigger pagination recalculation after adding content
      //   setTimeout(() => {
      //     const event = new Event("resize");
      //     window.dispatchEvent(event);
      //   }, 200);
      // }, 200); // Increased delay for pagination extension
    },

    addStorage() {
      return {
        isInitialized: false,
      };
    },

    addProseMirrorPlugins() {
      // Cache để lưu trữ chiều cao của các node để tối ưu performance
      const nodeHeightCache = new WeakMap<Element, number>();
      let isProcessing = false;

      // Tìm và xóa EmptyPlaceholderNode rỗng tiếp theo sau cursor
      const findAndRemoveEmptyPlaceholder = (view: any) => {
        if (isProcessing) return false;
        isProcessing = true;

        try {
          const { state } = view;
          const { selection } = state;
          const cursorPos = selection.from;

          // Tìm tất cả EmptyPlaceholderNode rỗng trong document
          const emptyPlaceholders: Array<{ pos: number; node: any }> = [];

          state.doc.descendants((node: any, pos: number) => {
            if (
              node.type.name === "emptyPlaceholder" &&
              node.textContent.trim() === ""
            ) {
              emptyPlaceholders.push({ pos, node });
            }
          });

          console.log("Found empty placeholders:", emptyPlaceholders.length);
          console.log("Cursor position:", cursorPos);

          // Tìm EmptyPlaceholderNode rỗng đầu tiên sau cursor
          const targetPlaceholder = emptyPlaceholders.find(
            (p) => p.pos >= cursorPos
          );

          if (targetPlaceholder) {
            console.log(
              "Removing placeholder at position:",
              targetPlaceholder.pos
            );
            const tr = state.tr.delete(
              targetPlaceholder.pos,
              targetPlaceholder.pos + targetPlaceholder.node.nodeSize
            );
            view.dispatch(tr);
            console.log("Successfully removed placeholder");
            isProcessing = false;
            return true;
          } else {
            console.log("No empty placeholder found after cursor");
          }
        } catch (error) {
          console.error("Error in findAndRemoveEmptyPlaceholder:", error);
        }

        isProcessing = false;
        return false;
      };

      // Kiểm tra text wrapping một cách tối ưu
      const checkTextWrapping = (view: any) => {
        if (isProcessing) return;

        const editorDom = view.dom;
        const placeholderElements = editorDom.querySelectorAll(
          "p.empty-placeholder"
        );

        console.log(
          "Checking text wrapping, found elements:",
          placeholderElements.length
        );

        // Chỉ kiểm tra các element có nội dung (không rỗng)
        for (const element of placeholderElements) {
          const htmlElement = element as HTMLElement;

          // Skip empty placeholders
          if (htmlElement.textContent?.trim() === "") continue;

          const currentHeight = htmlElement.offsetHeight;
          const cachedHeight = nodeHeightCache.get(htmlElement);
          const expectedSingleLineHeight = 23;

          console.log(
            "Element text:",
            htmlElement.textContent?.substring(0, 20)
          );
          console.log(
            "Current height:",
            currentHeight,
            "Expected:",
            expectedSingleLineHeight,
            "Cached:",
            cachedHeight
          );

          // Nếu chiều cao tăng lên và > 1 dòng → text đã wrap
          if (
            currentHeight > expectedSingleLineHeight &&
            (cachedHeight === undefined || currentHeight > cachedHeight)
          ) {
            console.log("🚨 TEXT WRAPPED! Triggering removal");
            // Update cache
            nodeHeightCache.set(htmlElement, currentHeight);

            // Xóa 1 EmptyPlaceholderNode rỗng ngay lập tức
            const removed = findAndRemoveEmptyPlaceholder(view);
            if (removed) {
              break; // Chỉ xử lý 1 element mỗi lần để tránh lag
            }
          } else if (cachedHeight === undefined) {
            // Cache initial height
            console.log("Caching initial height:", currentHeight);
            nodeHeightCache.set(htmlElement, currentHeight);
          }
        }
      };

      return [
        new Plugin({
          key: new PluginKey("emptyPlaceholderHandler"),
          props: {
            handleKeyDown: (view, event) => {
              // Xử lý Enter key
              if (event.key === "Enter") {
                findAndRemoveEmptyPlaceholder(view);
              }
              return false;
            },

            handleTextInput: (view) => {
              // Kiểm tra text wrapping sau khi nhập text
              checkTextWrapping(view);
              return false;
            },
          },

          view() {
            return {
              update: (view: any, prevState: any) => {
                // Chỉ kiểm tra khi có thay đổi nội dung thực sự
                if (view.state.doc !== prevState.doc) {
                  // Sử dụng requestAnimationFrame thay vì setTimeout để đồng bộ với browser rendering
                  requestAnimationFrame(() => checkTextWrapping(view));
                }
              },
            };
          },
        }),
      ];
    },
  });
