import { useEffect, useState } from "react";
import type { HeadingItem } from "~/types/heading";

interface ReadingProgress {
  headings: HeadingItem[];
  activeId: string;
  readHeadings: Set<string>;
}

export function useActiveHeading(): ReadingProgress {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [readHeadings, setReadHeadings] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Function to extract headings from actual DOM
    const extractHeadingsFromDOM = (): HeadingItem[] => {
      const headingElements = document.querySelectorAll(
        "article h1, article h2, article h3, article h4, article h5, article h6",
      );
      const items: HeadingItem[] = [];

      headingElements.forEach((element) => {
        const tagName = element.tagName.toLowerCase();
        const level = parseInt(tagName.charAt(1), 10);
        const text = element.textContent?.trim() || "";
        const id = element.id;

        if (id && text) {
          items.push({ id, text, level });
        }
      });

      return items;
    };

    // Function to initialize state based on current scroll position
    const initializeScrollState = (headingItems: HeadingItem[]) => {
      if (headingItems.length === 0) return;

      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const triggerPoint = scrollY + viewportHeight * 0.3; // 30% from top

      let currentActiveId = "";
      let currentActiveIndex = -1;

      // Find the heading that should be active based on scroll position
      for (let i = 0; i < headingItems.length; i++) {
        const element = document.getElementById(headingItems[i].id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + scrollY;

          if (elementTop <= triggerPoint) {
            currentActiveId = headingItems[i].id;
            currentActiveIndex = i;
          } else {
            break;
          }
        }
      }

      // Update state based on current scroll position
      if (currentActiveId && currentActiveIndex >= 0) {
        setActiveId(currentActiveId);

        // Mark all headings up to the current one as read
        const newReadHeadings = new Set<string>();
        for (let i = 0; i <= currentActiveIndex; i++) {
          newReadHeadings.add(headingItems[i].id);
        }
        setReadHeadings(newReadHeadings);
      } else if (scrollY < 100) {
        // If we're near the top, reset state
        setActiveId("");
        setReadHeadings(new Set());
      }
    };

    // Setup function with retry mechanism
    const setupHeadingsAndObserver = () => {
      const headingItems = extractHeadingsFromDOM();

      if (headingItems.length === 0) {
        // Retry after a short delay if no headings found
        setTimeout(setupHeadingsAndObserver, 100);
        return;
      }

      setHeadings(headingItems);

      // Initialize scroll state
      initializeScrollState(headingItems);

      const observerOptions = {
        rootMargin: "-10% 0% -60% 0%",
        threshold: [0, 0.1],
      };

      const observer = new IntersectionObserver((entries) => {
        // Process entries to find the topmost intersecting heading
        const intersectingEntries = entries.filter(
          (entry) => entry.isIntersecting,
        );

        if (intersectingEntries.length === 0) return;

        // Sort by position in document (top to bottom)
        intersectingEntries.sort((a, b) => {
          const aRect = a.boundingClientRect;
          const bRect = b.boundingClientRect;
          return aRect.top - bRect.top;
        });

        const topEntry = intersectingEntries[0];
        const headingId = topEntry.target.id;

        setActiveId(headingId);

        // Mark this heading and all previous headings as read
        const currentIndex = headingItems.findIndex((h) => h.id === headingId);
        if (currentIndex !== -1) {
          setReadHeadings((prev) => {
            const newReadHeadings = new Set(prev);
            for (let i = 0; i <= currentIndex; i++) {
              newReadHeadings.add(headingItems[i].id);
            }
            return newReadHeadings;
          });
        }
      }, observerOptions);

      // Observe all heading elements
      headingItems.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          observer.observe(element);
        }
      });

      // Handle edge case: scrolling to very top
      const handleScroll = () => {
        if (window.scrollY < 50) {
          setActiveId("");
          setReadHeadings(new Set());
        }
      };

      window.addEventListener("scroll", handleScroll, { passive: true });

      // Cleanup function
      return () => {
        observer.disconnect();
        window.removeEventListener("scroll", handleScroll);
      };
    };

    // Start setup with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(setupHeadingsAndObserver, 50);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []); // Empty dependency array - only run once on mount

  return { headings, activeId, readHeadings };
}
