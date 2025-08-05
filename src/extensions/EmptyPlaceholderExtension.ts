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

    getSimplePageFromPosition(view: any, position: number): number {
      const { state } = view;
      const linesPerPage = this.options.linesPerPage;
      
      // Count total nodes before this position
      let nodeCount = 0;
      state.doc.descendants((_node: any, pos: number) => {
        if (pos < position) {
          nodeCount++;
        }
      });
      
      // Calculate page (1-indexed)
      return Math.floor(nodeCount / linesPerPage) + 1;
    },

    getPageBoundaries(page: number): { start: number, end: number } {
      const linesPerPage = this.options.linesPerPage;
      return {
        start: (page - 1) * linesPerPage,
        end: page * linesPerPage
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

      // Tìm và xóa 1 EmptyPlaceholderNode rỗng trong trang hiện tại
      const findAndRemoveEmptyPlaceholder = (view: any) => {
        if (isProcessing) return false;
        isProcessing = true;

        try {
          const { state } = view;
          const { selection } = state;
          const cursorPos = selection.from;

          // Tính trang hiện tại từ cursor position
          let nodeCount = 0;
          state.doc.descendants((_node: any, pos: number) => {
            if (pos < cursorPos) {
              nodeCount++;
            }
          });
          const currentPage = Math.floor(nodeCount / this.options.linesPerPage) + 1;
          
          // Tính page boundaries
          const linesPerPage = this.options.linesPerPage;
          const pageStart = (currentPage - 1) * linesPerPage;
          const pageEnd = currentPage * linesPerPage;
          
          // Tìm empty placeholder trong trang hiện tại sau cursor
          let targetPos: number | null = null;
          let targetSize: number = 0;
          let nodeIndex = 0;

          state.doc.descendants((node: any, pos: number) => {
            // Chỉ xét nodes trong page boundaries
            if (nodeIndex >= pageStart && nodeIndex < pageEnd && targetPos === null) {
              if (
                node.type.name === "emptyPlaceholder" &&
                node.textContent.trim() === "" &&
                pos >= cursorPos // Sau cursor
              ) {
                targetPos = pos;
                targetSize = node.nodeSize;
              }
            }
            nodeIndex++;
          });

          // Xóa placeholder đã tìm thấy - CHO PHÉP grouping với Enter transaction
          if (targetPos !== null && targetSize > 0) {
            const tr = state.tr.delete(targetPos, targetPos + targetSize);
            // Không set addToHistory: false để cho phép history grouping
            
            view.dispatch(tr);
            console.log(`Removed empty placeholder in page ${currentPage} at position ${targetPos}`);
            isProcessing = false;
            return true;
          } else {
            console.log(`No empty placeholder found in page ${currentPage}`);
          }
        } catch (error) {
          console.error("Error in placeholder removal:", error);
        }

        isProcessing = false;
        return false;
      };

      // Text wrapping check với requestAnimationFrame
      const checkTextWrapping = (view: any) => {
        if (isProcessing) return;

        // Sử dụng requestAnimationFrame để xử lý mượt mà
        requestAnimationFrame(() => {
          const editorDom = view.dom;
          const allParagraphs = editorDom.querySelectorAll("p");

          for (const element of allParagraphs) {
            const htmlElement = element as HTMLElement;
            const currentHeight = htmlElement.offsetHeight;
            const cachedHeight = nodeHeightCache.get(htmlElement);
            const expectedLineHeight = this.options.lineHeight;

            // Kiểm tra text wrap (paragraph cao hơn expected)
            if (currentHeight > expectedLineHeight * 1.2) { // 20% tolerance
              if (cachedHeight === undefined || currentHeight > cachedHeight) {
                nodeHeightCache.set(htmlElement, currentHeight);
                
                console.log("Text wrapped, removing empty placeholder in current page");
                findAndRemoveEmptyPlaceholder(view);
                break; // Chỉ xử lý 1 lần
              }
            } else if (cachedHeight === undefined) {
              nodeHeightCache.set(htmlElement, currentHeight);
            }
          }
        });
      };

      return [
        new Plugin({
          key: new PluginKey("emptyPlaceholderHandler"),
          props: {
            handleKeyDown: (view, event) => {
              // Xử lý Enter key - TẠO 1 TRANSACTION DUY NHẤT
              if (event.key === "Enter") {
                console.log('Enter key pressed');
                
                const { state } = view;
                const { selection } = state;
                const cursorPos = selection.from;

                // Tính trang hiện tại
                let nodeCount = 0;
                state.doc.descendants((_node: any, pos: number) => {
                  if (pos < cursorPos) {
                    nodeCount++;
                  }
                });
                const currentPage = Math.floor(nodeCount / this.options.linesPerPage) + 1;
                
                // Tìm empty placeholder để xóa
                const linesPerPage = this.options.linesPerPage;
                const pageStart = (currentPage - 1) * linesPerPage;
                const pageEnd = currentPage * linesPerPage;
                
                let targetPos: number | null = null;
                let targetSize: number = 0;
                let nodeIndex = 0;

                state.doc.descendants((node: any, pos: number) => {
                  if (nodeIndex >= pageStart && nodeIndex < pageEnd && targetPos === null) {
                    if (
                      node.type.name === "emptyPlaceholder" &&
                      node.textContent.trim() === "" &&
                      pos >= cursorPos
                    ) {
                      targetPos = pos;
                      targetSize = node.nodeSize;
                    }
                  }
                  nodeIndex++;
                });

                // Tạo 1 TRANSACTION DUY NHẤT chứa cả Enter và Delete
                if (targetPos !== null && targetSize > 0) {
                  const tr = state.tr;
                  
                  // 1. Thực hiện Enter (split paragraph)
                  tr.split(cursorPos);
                  
                  // 2. Xóa placeholder (position có thể thay đổi sau split)
                  const adjustedTargetPos = targetPos > cursorPos ? targetPos + 1 : targetPos;
                  tr.delete(adjustedTargetPos, adjustedTargetPos + targetSize);
                  
                  view.dispatch(tr);
                  console.log(`Combined transaction: Enter + Delete placeholder in page ${currentPage}`);
                  return true; // Block default Enter vì đã xử lý
                }
                
                return false; // Let default Enter if no placeholder
              }
              return false;
            },

            handleTextInput: () => {
              // Let text input happen normally, don't interfere
              return false;
            },
          },

          view() {
            return {
              update: (view: any, prevState: any) => {
                // Chỉ kiểm tra khi có thay đổi nội dung thực sự
                if (view.state.doc !== prevState.doc) {
                  checkTextWrapping(view);
                }
              },
            };
          },
        }),
      ];
    },
  });
