import { Extension } from "@tiptap/core";
import "@tiptap/extension-text-style";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

export interface FontSizeOptions {
  types: string[];
  sizes: { label: string; value: string; class: string }[];
}

export const FontSize = Extension.create<FontSizeOptions>({
  name: "fontSize",

  addOptions() {
    return {
      types: ["textStyle"],
      sizes: [
        { label: "8.8px", value: "xsmall", class: "editor-text-xsmall" },
        { label: "10.8px", value: "small", class: "editor-text-small" },
        { label: "12.8px (Default)", value: "normal", class: "editor-text-normal" },
        { label: "14.8px", value: "large", class: "editor-text-large" },
      ],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => {
              const classList = Array.from(element.classList);
              const fontSizeClass = classList.find(cls => cls.startsWith('editor-text-'));
              if (fontSizeClass) {
                const size = this.options.sizes.find(s => s.class === fontSizeClass);
                return size ? size.value : null;
              }
              return null;
            },
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }

              const size = this.options.sizes.find(s => s.value === attributes.fontSize);
              if (!size) {
                return {};
              }

              return {
                class: size.class,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (size: string) =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize: size })
            .run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});