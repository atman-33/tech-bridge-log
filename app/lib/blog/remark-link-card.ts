import type { HTML, Link, Paragraph, Root, Text } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

type Replacement = {
  parent: Root | Paragraph;
  index: number;
  newNode: HTML;
};

/**
 * A remark plugin that transforms standalone URLs into custom LinkCard components.
 * It identifies paragraphs that contain only a single link where the link's text
 * is the same as its URL. It also handles text nodes that are standalone URLs.
 */
export const remarkLinkCard: Plugin<[], Root> = () => {
  return (tree: Root) => {
    const replacements: Replacement[] = [];

    visit(tree, "paragraph", (node: Paragraph, index, parent) => {
      // node type is now Paragraph
      if (!parent || typeof index !== "number") {
        return;
      }

      // Check if the paragraph contains a single child which is a link node
      if (node.children.length === 1 && node.children[0].type === "link") {
        const linkNode = node.children[0] as Link;

        // Check if the link contains a single text node
        if (
          linkNode.children.length === 1 &&
          linkNode.children[0].type === "text"
        ) {
          const textNode = linkNode.children[0] as Text;

          // Check if the link's text is the same as its URL
          if (linkNode.url === textNode.value) {
            const newNode: HTML = {
              type: "html",
              value: `<LinkCard url="${linkNode.url}" />`,
            };
            // Schedule the replacement instead of modifying the tree directly
            replacements.push({ parent: parent as any, index, newNode });
          }
        }
      }
      // Case 2: Paragraph contains a single text node which is a standalone URL
      // This case is now handled by remark-gfm converting it to a link node first.
      // So, this else if block is effectively dead code if remark-gfm is active.
      /*
      else if (node.children.length === 1 && node.children[0].type === "text") {
        const textNode = node.children[0] as Text;
        const url = textNode.value.trim();

        // Basic URL validation
        const URL_REGEX = /^https?:\/\/[^\s<>"']+$/;
        if (URL_REGEX.test(url)) {
          const newNode: HTML = {
            type: "html",
            value: `<LinkCard url="${url}" />`,
          };
          replacements.push({ parent: parent as any, index, newNode });
        }
      }
      */
    });

    // Perform replacements in reverse order to avoid index issues
    for (let i = replacements.length - 1; i >= 0; i--) {
      const { parent, index, newNode } = replacements[i];
      parent.children.splice(index, 1, newNode);
    }
  };
};
