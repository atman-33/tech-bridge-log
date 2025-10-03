import type { Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

/**
 * A remark plugin to log the structure of paragraph nodes for debugging purposes.
 */
export const remarkDebugLog: Plugin<[], Root> = (options?: {
  label?: string;
}) => {
  const label = options?.label ? `[${options.label}] ` : "";
  return (tree: Root) => {
    console.log(`--- ${label}AST Debug Log Start ---`);
    visit(
      tree,
      ["paragraph", "link", "html", "mdxJsxFlowElement"],
      // biome-ignore lint/suspicious/noExplicitAny: <>
      (node: any, index, parent) => {
        console.log(`${label}Node Type: ${node.type}, Index: ${index}`);
        console.log(JSON.stringify(node, null, 2));
        if (parent) {
          console.log(
            `${label}Parent Children Length: ${parent.children.length}`
          );
        }
      }
    );
    console.log(`--- ${label}AST Debug Log End ---`);
  };
};
