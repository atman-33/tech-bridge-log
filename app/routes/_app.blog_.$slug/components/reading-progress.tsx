import { useEffect, useState } from "react";

type ReadingProgressProps = {
  target?: string; // CSS selector for the content container
};

export function ReadingProgress({ target = "article" }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const targetElement = document.querySelector(target) as HTMLElement;
      if (!targetElement) {
        return;
      }

      const windowHeight = window.innerHeight;

      // Calculate how much of the article has been scrolled past
      const scrollTop = window.scrollY;
      const elementTop = targetElement.offsetTop;
      const elementHeight = targetElement.offsetHeight;

      // Start progress when article comes into view
      const startProgress = elementTop - windowHeight * 0.2;
      const endProgress = elementTop + elementHeight - windowHeight * 0.8;

      if (scrollTop < startProgress) {
        setProgress(0);
      } else if (scrollTop > endProgress) {
        setProgress(100);
      } else {
        const progressRange = endProgress - startProgress;
        const currentProgress = scrollTop - startProgress;
        const percentage = Math.min(
          100,
          Math.max(0, (currentProgress / progressRange) * 100)
        );
        setProgress(percentage);
      }
    };

    // Update progress on scroll
    window.addEventListener("scroll", updateProgress, { passive: true });
    // Update progress on resize
    window.addEventListener("resize", updateProgress, { passive: true });
    // Initial calculation
    updateProgress();

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [target]);

  return (
    <div className="fixed top-0 right-0 left-0 z-50 h-1 bg-muted">
      <div
        className="h-full bg-primary transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
