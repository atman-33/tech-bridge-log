import type { Link, Paragraph, Root, Text } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

type Replacement = {
  parent: Root | Paragraph;
  index: number;
  newNode: Paragraph; // Change to Paragraph as we are just marking it
};

/**
 * A remark plugin that transforms standalone URLs into marked paragraphs.
 * These marked paragraphs will later be transformed into LinkCard components by a rehype plugin.
 */
export const remarkLinkCard: Plugin<[], Root> = () => {
  return (tree: Root) => {
    const replacements: Replacement[] = [];

    visit(tree, "paragraph", (node: Paragraph, index, parent) => {
      if (!parent || typeof index !== "number") {
        return;
      }

      let urlToMark: string | null = null;

      // Case 1: Paragraph contains a single link node (e.g., auto-linked by remark-gfm)
      if (node.children.length === 1 && node.children[0].type === "link") {
        const linkNode = node.children[0] as Link;

        // Check if the link contains a single text node
        if (
          linkNode.children.length === 1 &&
          linkNode.children[0].type === "text"
        ) {
          const textNode = linkNode.children[0] as Text;

          // Check if the link's text content is the same as its URL (standalone URL)
          if (linkNode.url === textNode.value) {
            urlToMark = linkNode.url;
          }
        }
      }
      // Case 2: Paragraph contains a single text node which is a standalone URL
      // This is mainly for cases where remark-gfm might be disabled or not auto-linking
      else if (node.children.length === 1 && node.children[0].type === "text") {
        const textNode = node.children[0] as Text;
        const url = textNode.value.trim();

        // Basic URL validation
        const URL_REGEX = /^https?:\/\/[^\s<>"']+$/;
        if (URL_REGEX.test(url)) {
          urlToMark = url;
        }
      }

      if (urlToMark) {
        // Create a new paragraph node with a special data attribute
        const newNode: Paragraph = {
          type: "paragraph",
          data: {
            hProperties: {
              "data-linkcard-url": urlToMark,
            },
          },
          children: [], // No children needed for this marker node
        };
        // Schedule the replacement
        replacements.push({ parent: parent as any, index, newNode });
      }
    });

    // Perform replacements in reverse order to avoid index issues
    for (let i = replacements.length - 1; i >= 0; i--) {
      const { parent, index, newNode } = replacements[i];
      parent.children.splice(index, 1, newNode);
    }
  };
};
