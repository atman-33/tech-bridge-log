import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./button";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      aria-label="Scroll to top"
      className="fixed right-6 bottom-6 z-50 rounded-full border-border/50 bg-background/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
      onClick={scrollToTop}
      size="icon"
      variant="outline"
    >
      <ChevronUp className="h-4 w-4" />
    </Button>
  );
}
