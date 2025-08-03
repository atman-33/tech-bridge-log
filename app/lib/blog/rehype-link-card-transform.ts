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
      // console.log("node", node);

      if (
        node.tagName === "p" &&
        node.properties &&
        node.properties.dataLinkcardUrl
      ) {
        const url = String(node.properties.dataLinkcardUrl);
        console.log("url", url);

        // Transform the node into an mdxJsxFlowElement
        const newNode: Element = {
          type: "element",
          tagName: "linkcard",
          properties: { url },
          children: [],
        };

        // Replace the original paragraph node with the new mdxJsxFlowElement
        parent.children.splice(index, 1, newNode);
        console.log("newNode", newNode);
      }
    });
  };
};
