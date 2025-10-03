import { useEffect, useState } from "react";
import type { HeadingItem } from "~/types/heading";

type ReadingProgress = {
  headings: HeadingItem[];
  activeId: string;
  readHeadings: Set<string>;
};

export function useActiveHeading(): ReadingProgress {
  const [state, setState] = useState<ReadingProgress>({
    headings: [],
    activeId: "",
    readHeadings: new Set(),
  });

  useEffect(() => {
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ignore
    const calculateActiveHeading = () => {
      // Extract headings from actual DOM (similar to reading-progress.tsx approach)
      const headingElements = document.querySelectorAll(
        "article h1, article h2, article h3, article h4, article h5, article h6"
      );

      // Early return if no headings found (not an error, just empty state)
      if (headingElements.length === 0) {
        setState({
          headings: [],
          activeId: "",
          readHeadings: new Set(),
        });
        return;
      }

      // Build headings array from DOM elements
      const headings: HeadingItem[] = [];
      // biome-ignore lint/complexity/noForEach: ignore
      headingElements.forEach((element) => {
        const tagName = element.tagName.toLowerCase();
        const level = Number.parseInt(tagName.charAt(1), 10);
        const text = element.textContent?.trim() || "";
        const id = element.id;

        if (id && text) {
          headings.push({ id, text, level });
        }
      });

      // Calculate current scroll position and viewport
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const triggerPoint = scrollY + viewportHeight * 0.3; // 30% from top

      // Find active heading based on scroll position (mathematical calculation)
      let currentActiveId = "";
      let currentActiveIndex = -1;

      for (let i = 0; i < headings.length; i++) {
        const element = document.getElementById(headings[i].id);
        if (!element) {
          continue;
        }

        const elementTop = element.offsetTop;

        if (elementTop <= triggerPoint) {
          currentActiveId = headings[i].id;
          currentActiveIndex = i;
        } else {
          break;
        }
      }

      // Calculate read headings based on active heading
      const newReadHeadings = new Set<string>();
      if (currentActiveIndex >= 0) {
        for (let i = 0; i <= currentActiveIndex; i++) {
          newReadHeadings.add(headings[i].id);
        }
      }

      // Handle edge case: very top of page
      if (scrollY < 50) {
        currentActiveId = "";
        newReadHeadings.clear();
      }

      // Update state atomically (single state update like reading-progress.tsx)
      setState({
        headings,
        activeId: currentActiveId,
        readHeadings: newReadHeadings,
      });
    };

    // Initial calculation (immediate, no delay like reading-progress.tsx)
    calculateActiveHeading();

    // Add scroll listener (same pattern as reading-progress.tsx)
    window.addEventListener("scroll", calculateActiveHeading, {
      passive: true,
    });
    // Add resize listener for viewport changes
    window.addEventListener("resize", calculateActiveHeading, {
      passive: true,
    });

    // Cleanup (simple and reliable like reading-progress.tsx)
    return () => {
      window.removeEventListener("scroll", calculateActiveHeading);
      window.removeEventListener("resize", calculateActiveHeading);
    };
  }, []); // Empty dependency array - only run once on mount

  return state;
}
