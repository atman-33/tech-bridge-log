import type { HTML, Html, Paragraph, Root, Text } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

const URL_REGEX = /^https?:\/\/[^\s<>"']+$/;

type Replacement = {
  parent: Root | Paragraph;
  index: number;
  newNode: Html;
};

/**
 * A remark plugin to transform standalone URLs into custom LinkCard components.
 * It operates on the Markdown AST (mdast).
 */
export const remarkLinkCard: Plugin<[], Root> = () => {
  return (tree: Root) => {
    const replacements: Replacement[] = [];

    visit(tree, "paragraph", (node: Paragraph, index, parent) => {
      if (!parent || typeof index !== "number") {
        return;
      }

      if (node.children.length === 1 && node.children[0].type === "text") {
        const textNode = node.children[0] as Text;
        const url = textNode.value.trim();

        if (URL_REGEX.test(url)) {
          const newNode: Html = {
            type: "html",
            value: `<LinkCard url="${url}" />`,
          };
          // Schedule the replacement instead of doing it immediately.
          replacements.push({ parent: parent as any, index, newNode });
        }
      }
    });

    // Perform replacements in reverse order to avoid index issues.
    for (let i = replacements.length - 1; i >= 0; i--) {
      const { parent, index, newNode } = replacements[i];
      parent.children.splice(index, 1, newNode);
    }
  };
};
