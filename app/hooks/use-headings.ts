import { useEffect, useState } from "react";
import type { HeadingItem } from "~/types/heading";
import { generateHeadingId } from "~/utils/heading-utils";

export function useHeadings(content: string): HeadingItem[] {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const items: HeadingItem[] = [];
    let match: RegExpExecArray | null;

    match = headingRegex.exec(content);
    while (match !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = generateHeadingId(text);

      items.push({ id, text, level });
      match = headingRegex.exec(content);
    }

    setHeadings(items);
  }, [content]);

  return headings;
}
