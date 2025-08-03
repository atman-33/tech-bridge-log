import type { HTML, Link, Paragraph, Root, Text } from "mdast";
import type { Plugin } from "unified";
import { SKIP, visit } from "unist-util-visit";

/**
 * A remark plugin that transforms standalone URLs into custom LinkCard components.
 * It identifies paragraphs that contain only a single link where the link's text
 * is the same as its URL.
 */
export const remarkLinkCard: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, "paragraph", (node: Paragraph, index, parent) => {
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

            // Replace the original paragraph node with the new HTML node
            parent.children.splice(index, 1, newNode);

            // Skip further processing of this node
            return SKIP;
          }
        }
      }
    });
  };
};
