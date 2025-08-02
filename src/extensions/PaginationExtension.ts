import { Extension } from "@tiptap/core";
import { EditorState, Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet, EditorView } from "@tiptap/pm/view";

interface PaginationPlusOptions {
  pageHeight: number;
  pageGap: number;
  pageBreakBackground: string;
  pageHeaderHeight: number;
  pageGapBorderSize: number;
  footerRight: string;
  footerLeft: string;
  headerRight: string;
  headerLeft: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pagination: {
      setZoom: (zoom: number) => ReturnType
      getZoom: () => ReturnType
      insertPageBreak: () => ReturnType
      addPage: () => ReturnType
    }
  }
}

const page_count_meta_key = "PAGE_COUNT_META_KEY";

// Zoom management system
let managedZoomLevel = 1;
let zoomChangeCallbacks: ((zoom: number) => void)[] = [];

// Manual page management
let manualPageCount = 1;

const ZoomManager = {
  setZoom(zoom: number) {
    managedZoomLevel = zoom;
    zoomChangeCallbacks.forEach(callback => callback(zoom));
  },
  
  getZoom(): number {
    return managedZoomLevel;
  },
  
  onZoomChange(callback: (zoom: number) => void) {
    zoomChangeCallbacks.push(callback);
    return () => {
      zoomChangeCallbacks = zoomChangeCallbacks.filter(cb => cb !== callback);
    };
  }
};

// Helper function to get current zoom - use managed zoom instead of detecting
const getZoomLevel = (): number => {
  return ZoomManager.getZoom();
};

export const PaginationPlus = Extension.create<PaginationPlusOptions>({
  name: "PaginationPlus",
  addOptions() {
    return {
      pageHeight: 800,
      pageGap: 50,
      pageGapBorderSize: 1,
      pageBreakBackground: "#ffffff",
      pageHeaderHeight: 10,
      footerRight: "{page}",
      footerLeft: "",
      headerRight: "",
      headerLeft: "",
    };
  },

  addCommands() {
    return {
      setZoom:
        (zoom: number) =>
        ({ editor }) => {
          ZoomManager.setZoom(zoom);
          // Apply zoom to the editor container
          const editorDom = editor.view.dom.closest('.editor-container') as HTMLElement;
          if (editorDom) {
            editorDom.style.zoom = zoom.toString();
          }
          return true;
        },
      getZoom:
        () =>
        () => {
          return ZoomManager.getZoom();
        },
      insertPageBreak:
        () =>
        ({ commands }) => {
          return commands.insertContent('<div class="manual-page-break" style="page-break-before: always; height: 0; margin: 0; padding: 0;"></div>')
        },
      addPage:
        () =>
        ({ editor, commands }) => {
          manualPageCount++;
          
          // Add content to fill the page if editor is empty or has minimal content
          const currentContent = editor.getText();
          const lineCount = currentContent.split('\n').length;
          const linesNeeded = manualPageCount * 18; // 18 lines per page
          
          if (lineCount < linesNeeded) {
            // Add empty paragraphs to fill the pages
            const linesToAdd = linesNeeded - lineCount;
            const newLines = Array(linesToAdd).fill('<p></p>').join('');
            commands.insertContent(newLines);
          }
          
          // Trigger pagination update
          const tr = editor.view.state.tr.setMeta(
            page_count_meta_key,
            Date.now()
          );
          editor.view.dispatch(tr);
          return true;
        },
    }
  },
  onCreate() {
    const targetNode = this.editor.view.dom;
    targetNode.classList.add("rm-with-pagination");
    const config = { attributes: true };
    const _pageHeaderHeight = this.options.pageHeaderHeight;
    const _pageHeight = this.options.pageHeight - _pageHeaderHeight * 2;

    const style = document.createElement("style");
    style.dataset.rmPaginationStyle = "";

    style.textContent = `
      .rm-with-pagination {
        counter-reset: page-number;
      }
      .rm-with-pagination .rm-page-footer {
        counter-increment: page-number;
      }
      .rm-with-pagination .rm-page-break:last-child .rm-pagination-gap {
        display: none;
      }
      .rm-with-pagination .rm-page-break:last-child .rm-page-header {
        display: none;
      }
      
      .rm-with-pagination table tr td,
      .rm-with-pagination table tr th {
        word-break: break-all;
      }
      .rm-with-pagination table > tr {
        display: grid;
        min-width: 100%;
      }
      .rm-with-pagination table {
        border-collapse: collapse;
        width: 100%;
        display: contents;
      }
      .rm-with-pagination table tbody{
        display: table;
        max-height: 300px;
        overflow-y: auto;
      }
      .rm-with-pagination table tbody > tr{
        display: table-row !important;
      }
      .rm-with-pagination p:has(br.ProseMirror-trailingBreak:only-child) {
        display: table;
        width: 100%;
      }
      .rm-with-pagination .table-row-group {
        max-height: ${_pageHeight}px;
        overflow-y: auto;
        width: 100%;
      }
      .rm-with-pagination .rm-page-footer-left,
      .rm-with-pagination .rm-page-footer-right,
      .rm-with-pagination .rm-page-header-left,
      .rm-with-pagination .rm-page-header-right {
        display: inline-block;
      }
      .rm-with-pagination .rm-page-header-left,
      .rm-with-pagination .rm-page-header-right{
        padding-top: 15px !important;
      }

      .rm-with-pagination .rm-page-header-left,
      .rm-with-pagination .rm-page-footer-left{
        float: left;
        margin-left: 25px;
      }
      .rm-with-pagination .rm-page-header-right,
      .rm-with-pagination .rm-page-footer-right{
        float: right;
        margin-right: 25px;
      }
      .rm-with-pagination .rm-page-number::before {
        content: counter(page-number);
      }
      .rm-with-pagination .rm-first-page-header{
        display: inline-flex;
        justify-content: space-between;
        width: 100%;
        padding-top: 15px !important;
      }
    `;
    document.head.appendChild(style);

    const refreshPage = (targetNode: HTMLElement) => {
      const paginationElement = targetNode.querySelector(
        "[data-rm-pagination]"
      );
      if (paginationElement) {
        const lastPageBreak = paginationElement.lastElementChild?.querySelector(
          ".breaker"
        ) as HTMLElement;
        if (lastPageBreak) {
          // Keep original calculation to maintain layout stability
          const minHeight = lastPageBreak.offsetTop + lastPageBreak.offsetHeight;
          targetNode.style.minHeight = `${minHeight}px`;
        }
      }
    };

    let debounceTimeout: NodeJS.Timeout;
    let isZoomChanging = false;
    
    // Listen for zoom changes to pause pagination updates
    const unsubscribeZoom = ZoomManager.onZoomChange(() => {
      isZoomChanging = true;
      setTimeout(() => {
        isZoomChanging = false;
      }, 200); // Give zoom transition time to complete
    });
    
    const callback = (
      mutationList: MutationRecord[],
      observer: MutationObserver
    ) => {
      // Skip all updates during zoom changes
      if (isZoomChanging) return;
      
      // Clear previous timeout to debounce rapid changes
      clearTimeout(debounceTimeout);
      
      debounceTimeout = setTimeout(() => {
        if (mutationList.length > 0 && mutationList[0].target) {
          const _target = mutationList[0].target as HTMLElement;
          if (_target.classList.contains("rm-with-pagination")) {
            // Only process actual content changes to prevent blinking
            const isContentMutation = mutationList.some(mutation => {
              if (mutation.type === 'childList') {
                // Check for text nodes or non-pagination elements
                return Array.from(mutation.addedNodes).some(node => 
                  node.nodeType === Node.TEXT_NODE || 
                  (node.nodeType === Node.ELEMENT_NODE && 
                   !(node as Element).hasAttribute('data-rm-pagination') &&
                   !(node as Element).classList.contains('rm-page-break') &&
                   !(node as Element).classList.contains('breaker') &&
                   !(node as Element).classList.contains('manual-page-break'))
                );
              }
              return false;
            });
            
            if (isContentMutation) {
              const currentPageCount = getExistingPageCount(this.editor.view);
              const pageCount = calculatePageCount(this.editor.view, this.options);
              if (Math.abs(currentPageCount - pageCount) >= 1) {
                const tr = this.editor.view.state.tr.setMeta(
                  page_count_meta_key,
                  Date.now()
                );
                this.editor.view.dispatch(tr);
              }
            }

            refreshPage(_target);
          }
        }
      }, 100); // Increased debounce for stability
    };
    
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, { 
      childList: true, 
      subtree: true, 
      attributes: false // Don't watch attribute changes which can be triggered by zoom
    });
    refreshPage(targetNode);
  },
  addProseMirrorPlugins() {
    const pageOptions = this.options;
    const editor = this.editor;
    return [
      new Plugin({
        key: new PluginKey("pagination"),

        state: {
          init(_, state) {
            const widgetList = createDecoration(state, pageOptions);
            return DecorationSet.create(state.doc, widgetList);
          },
          apply(tr, oldDeco, oldState, newState) {
            // Only recalculate if there are actual document changes, not just zoom/style changes
            if (!tr.docChanged && !tr.getMeta(page_count_meta_key)) {
              return oldDeco;
            }
            
            // Debounce decoration updates to prevent zoom-related infinite loops
            const now = Date.now();
            const lastUpdate = tr.getMeta('pagination-last-update') || 0;
            if (now - lastUpdate < 100) { // 100ms cooldown
              return oldDeco;
            }
            
            const pageCount = calculatePageCount(editor.view, pageOptions);
            const currentPageCount = getExistingPageCount(editor.view);
            if ((pageCount > 1 ? pageCount : 1) !== currentPageCount) {
              const widgetList = createDecoration(newState, pageOptions);
              // Set metadata to track last update time
              tr.setMeta('pagination-last-update', now);
              return DecorationSet.create(newState.doc, [...widgetList]);
            }
            return oldDeco;
          },
        },

        props: {
          decorations(state: EditorState) {
            return this.getState(state) as DecorationSet;
          },
        },
      }),
    ];
  },
});

const getExistingPageCount = (view: EditorView) => {
  const editorDom = view.dom;
  const paginationElement = editorDom.querySelector("[data-rm-pagination]");
  if (paginationElement) {
    return paginationElement.children.length;
  }
  return 0;
};

const calculatePageCount = (
  view: EditorView,
  pageOptions: PaginationPlusOptions
) => {
  const editorDom = view.dom;
  const pageContentAreaHeight =
    pageOptions.pageHeight - pageOptions.pageHeaderHeight * 2;
  const paginationElement = editorDom.querySelector("[data-rm-pagination]");
  const currentPageCount = getExistingPageCount(view);
  
  if (paginationElement) {
    const lastElementOfEditor = editorDom.lastElementChild;
    const lastPageBreak =
      paginationElement.lastElementChild?.querySelector(".breaker");
    if (lastElementOfEditor && lastPageBreak) {
      const lastPageGap =
        lastElementOfEditor.getBoundingClientRect().bottom -
        lastPageBreak.getBoundingClientRect().bottom;
      if (lastPageGap > 0) {
        const addPage = Math.ceil(lastPageGap / pageContentAreaHeight);
        const calculatedPages = currentPageCount + addPage;
        return Math.max(calculatedPages, manualPageCount);
      } else {
        const lpFrom = -pageOptions.pageHeaderHeight;
        const lpTo = -(pageOptions.pageHeight - pageOptions.pageHeaderHeight);
        if (lastPageGap > lpTo && lastPageGap < lpFrom) {
          return Math.max(currentPageCount, manualPageCount);
        } else if (lastPageGap < lpTo) {
          const pageHeightOnRemove =
            pageOptions.pageHeight + pageOptions.pageGap;
          const removePage = Math.floor(lastPageGap / pageHeightOnRemove);
          const calculatedPages = currentPageCount + removePage;
          return Math.max(calculatedPages, manualPageCount);
        } else {
          return Math.max(currentPageCount, manualPageCount);
        }
      }
    }
    return manualPageCount;
  } else {
    const editorHeight = editorDom.scrollHeight;
    const pageCount = Math.ceil(editorHeight / pageContentAreaHeight);
    return Math.max(pageCount, manualPageCount);
  }
};

function createDecoration(
  state: EditorState,
  pageOptions: PaginationPlusOptions,
  isInitial: boolean = false
): Decoration[] {
  const pageWidget = Decoration.widget(
    0,
    (view) => {
      const _pageGap = pageOptions.pageGap;
      const _pageHeaderHeight = pageOptions.pageHeaderHeight;
      const _pageHeight = pageOptions.pageHeight - _pageHeaderHeight * 2;
      const _pageBreakBackground = pageOptions.pageBreakBackground;

      // Get actual container width - don't normalize as this affects layout consistency
      const breakerWidth = view.dom.clientWidth;

      const el = document.createElement("div");
      el.dataset.rmPagination = "true";

      const pageBreakDefinition = ({
        firstPage = false,
        lastPage = false,
      }: {
        firstPage: boolean;
        lastPage: boolean;
      }) => {
        const pageContainer = document.createElement("div");
        pageContainer.classList.add("rm-page-break");

        const page = document.createElement("div");
        page.classList.add("page");
        page.style.position = "relative";
        page.style.float = "left";
        page.style.clear = "both";
        page.style.marginTop = firstPage
          ? `calc(${_pageHeaderHeight}px + ${_pageHeight}px)`
          : _pageHeight + "px";

        const pageBreak = document.createElement("div");
        pageBreak.classList.add("breaker");
        pageBreak.style.width = `calc(${breakerWidth}px)`;
        pageBreak.style.marginLeft = `calc(calc(calc(${breakerWidth}px - 100%) / 2) - calc(${breakerWidth}px - 100%))`;
        pageBreak.style.marginRight = `calc(calc(calc(${breakerWidth}px - 100%) / 2) - calc(${breakerWidth}px - 100%))`;
        pageBreak.style.position = "relative";
        pageBreak.style.float = "left";
        pageBreak.style.clear = "both";
        pageBreak.style.left = "0px";
        pageBreak.style.right = "0px";
        pageBreak.style.zIndex = "2";

        const pageFooter = document.createElement("div");
        pageFooter.classList.add("rm-page-footer");
        pageFooter.style.height = _pageHeaderHeight + "px";

        const footerRight = pageOptions.footerRight.replace(
          "{page}",
          `<span class="rm-page-number"></span>`
        );
        const footerLeft = pageOptions.footerLeft.replace(
          "{page}",
          `<span class="rm-page-number"></span>`
        );

        const pageFooterLeft = document.createElement("div");
        pageFooterLeft.classList.add("rm-page-footer-left");
        pageFooterLeft.innerHTML = footerLeft;

        const pageFooterRight = document.createElement("div");
        pageFooterRight.classList.add("rm-page-footer-right");
        pageFooterRight.innerHTML = footerRight;

        pageFooter.append(pageFooterLeft);
        pageFooter.append(pageFooterRight);

        const pageSpace = document.createElement("div");
        pageSpace.classList.add("rm-pagination-gap");
        pageSpace.style.height = _pageGap + "px";
        pageSpace.style.borderLeft = "1px solid";
        pageSpace.style.borderRight = "1px solid";
        pageSpace.style.position = "relative";
        pageSpace.style.setProperty("width", "calc(100% + 2px)", "important");
        pageSpace.style.left = "-1px";
        pageSpace.style.backgroundColor = _pageBreakBackground;
        pageSpace.style.borderLeftColor = _pageBreakBackground;
        pageSpace.style.borderRightColor = _pageBreakBackground;

        const pageHeader = document.createElement("div");
        pageHeader.classList.add("rm-page-header");
        pageHeader.style.height = _pageHeaderHeight + "px";

        const pageHeaderLeft = document.createElement("div");
        pageHeaderLeft.classList.add("rm-page-header-left");
        pageHeaderLeft.innerHTML = pageOptions.headerLeft;

        const pageHeaderRight = document.createElement("div");
        pageHeaderRight.classList.add("rm-page-header-right");
        pageHeaderRight.innerHTML = pageOptions.headerRight;

        pageHeader.append(pageHeaderLeft, pageHeaderRight);
        pageBreak.append(pageFooter, pageSpace, pageHeader);
        pageContainer.append(page, pageBreak);

        return pageContainer;
      };

      const page = pageBreakDefinition({ firstPage: false, lastPage: false });
      const firstPage = pageBreakDefinition({
        firstPage: true,
        lastPage: false,
      });
      const fragment = document.createDocumentFragment();

      const pageCount = calculatePageCount(view, pageOptions);

      for (let i = 0; i < pageCount; i++) {
        if (i === 0) {
          fragment.appendChild(firstPage.cloneNode(true));
        } else {
          fragment.appendChild(page.cloneNode(true));
        }
      }
      el.append(fragment);
      el.id = "pages";

      return el;
    },
    { side: -1 }
  );
  const firstHeaderWidget = Decoration.widget(
    0,
    () => {
      const el = document.createElement("div");
      el.style.position = "relative";
      el.classList.add("rm-first-page-header");

      const pageHeaderLeft = document.createElement("div");
      pageHeaderLeft.classList.add("rm-first-page-header-left");
      pageHeaderLeft.innerHTML = pageOptions.headerLeft;
      el.append(pageHeaderLeft);

      const pageHeaderRight = document.createElement("div");
      pageHeaderRight.classList.add("rm-first-page-header-right");
      pageHeaderRight.innerHTML = pageOptions.headerRight;
      el.append(pageHeaderRight);

      el.style.height = `${pageOptions.pageHeaderHeight}px`;
      return el;
    },
    { side: -1 }
  );

  return !isInitial ? [pageWidget, firstHeaderWidget] : [pageWidget];
}

// Export ZoomManager for external use
export { ZoomManager };