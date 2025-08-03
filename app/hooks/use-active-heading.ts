import { useEffect, useState } from "react";
import type { HeadingItem } from "~/types/heading";

interface ReadingProgress {
  activeId: string;
  readHeadings: Set<string>;
}

export function useActiveHeading(headings: HeadingItem[]): ReadingProgress {
  const [activeId, setActiveId] = useState<string>("");
  const [readHeadings, setReadHeadings] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (headings.length === 0) return;

    const observerOptions = {
      rootMargin: "-20% 0% -35% 0%",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const headingId = entry.target.id;
          setActiveId(headingId);

          // Mark this heading and all previous headings as read
          const currentIndex = headings.findIndex((h) => h.id === headingId);
          if (currentIndex !== -1) {
            const newReadHeadings = new Set<string>();
            for (let i = 0; i <= currentIndex; i++) {
              newReadHeadings.add(headings[i].id);
            }
            setReadHeadings(newReadHeadings);
          }
        }
      });
    }, observerOptions);

    // Observe all headings
    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  return { activeId, readHeadings };
}
