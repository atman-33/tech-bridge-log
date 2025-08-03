import type { Element, Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

/**
 * A rehype plugin that transforms marked paragraphs (from remarkLinkCard)
 * into mdxJsxFlowElement nodes for React component rendering.
 */
export const rehypeLinkCardTransform: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (!parent || typeof index !== "number") {
        return;
      }

      // Check if this is a paragraph element marked by remarkLinkCard
      if (
        node.tagName === "p" &&
        node.properties &&
        node.properties["data-linkcard-url"]
      ) {
        const url = String(node.properties["data-linkcard-url"]);

        // Transform the node into an mdxJsxFlowElement
        const newNode: any = {
          type: "mdxJsxFlowElement",
          name: "LinkCard", // This must match the key in components prop of ReactMarkdown
          attributes: [
            {
              type: "mdxJsxAttribute",
              name: "url",
              value: url,
            },
          ],
          children: [], // LinkCard component will handle its own children
        };

        // Replace the original paragraph node with the new mdxJsxFlowElement
        parent.children.splice(index, 1, newNode);
      }
    });
  };
};
