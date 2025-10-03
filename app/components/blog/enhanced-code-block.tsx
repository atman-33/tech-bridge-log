import { Check, Copy, Maximize2, WrapText } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type EnhancedCodeBlockProps = {
  children: React.ReactNode;
  className?: string;
  language?: string;
};

export function EnhancedCodeBlock({
  children,
  className,
  language,
}: EnhancedCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isWrapped, setIsWrapped] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  // Extract the actual code content from children
  const getCodeContent = useCallback(() => {
    if (typeof children === "string") {
      return children;
    }

    // Handle React elements - extract text content
    const extractText = (node: React.ReactNode): string => {
      if (typeof node === "string") {
        return node;
      }
      if (typeof node === "number") {
        return String(node);
      }
      if (Array.isArray(node)) {
        return node.map(extractText).join("");
      }
      if (node && typeof node === "object" && "props" in node) {
        // biome-ignore lint/suspicious/noExplicitAny: ignore
        return extractText((node as any).props.children);
      }
      return "";
    };

    return extractText(children);
  }, [children]);

  const handleCopy = async () => {
    const codeContent = getCodeContent();

    try {
      await navigator.clipboard.writeText(codeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = codeContent;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error("Failed to copy code:", fallbackErr);
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  const toggleWrap = () => {
    setIsWrapped(!isWrapped);
  };

  // Extract language from className
  // Handle both "language-javascript" and "hljs language-javascript" formats
  // biome-ignore lint/nursery/noShadow: ignore
  const extractLanguage = (className?: string): string => {
    if (!className) {
      return "";
    }

    // Remove hljs prefix and extract language
    const cleaned = className.replace(/^hljs\s+/, "");
    const match = cleaned.match(/language-(\w+)/);
    return match ? match[1] : "";
  };

  const detectedLanguage = language || extractLanguage(className) || "";

  return (
    <div className="group relative mb-4">
      {/* Header with language and controls */}
      <div className="flex items-center justify-between rounded-t-lg border border-border border-b-1 bg-muted/30 px-4 py-2">
        <div className="flex items-center gap-2">
          {detectedLanguage && (
            <span className="font-mono text-muted-foreground text-xs uppercase tracking-wide">
              {detectedLanguage}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-100 transition-opacity duration-200 group-hover:opacity-100 sm:opacity-0">
          <Button
            className="h-7 px-2 text-xs"
            onClick={toggleWrap}
            size="sm"
            title={isWrapped ? "Disable word wrap" : "Enable word wrap"}
            variant="ghost"
          >
            {isWrapped ? (
              <Maximize2 className="h-3 w-3" />
            ) : (
              <WrapText className="h-3 w-3" />
            )}
          </Button>

          <Button
            className={cn(
              "h-7 px-2 text-xs transition-colors",
              copied && "text-green-600 dark:text-green-400"
            )}
            onClick={handleCopy}
            size="sm"
            title="Copy code"
            variant="ghost"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                <span className="ml-1">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span className="ml-1">Copy</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Code content */}
      <pre
        className={cn(
          "overflow-x-auto rounded-b-lg border border-border border-t-0 bg-muted p-0 text-sm",
          "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/50"
        )}
      >
        <code
          className={cn(
            className,
            "font-mono",
            isWrapped ? "whitespace-pre-wrap break-words" : "whitespace-pre"
          )}
          ref={codeRef}
        >
          {children}
        </code>
      </pre>
    </div>
  );
}
