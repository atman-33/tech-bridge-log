// Utility to detect standalone URLs and convert them to link card components
export function processLinkCards(content: string): string {
  // First, find all code blocks and mark their positions
  const codeBlockRanges: Array<{ start: number; end: number }> = [];

  // Match fenced code blocks (``` or ````)
  const fencedCodeRegex = /^(`{3,4})[^`\n]*\n([\s\S]*?)\n\1\s*$/gm;
  let match: RegExpExecArray | null;

  match = fencedCodeRegex.exec(content);
  while (match !== null) {
    codeBlockRanges.push({
      start: match.index,
      end: match.index + match[0].length,
    });
    match = fencedCodeRegex.exec(content);
  }

  // Reset regex
  fencedCodeRegex.lastIndex = 0;

  // Also match inline code blocks (single backticks)
  const inlineCodeRegex = /`[^`\n]+`/g;
  match = inlineCodeRegex.exec(content);
  while (match !== null) {
    codeBlockRanges.push({
      start: match.index,
      end: match.index + match[0].length,
    });
    match = inlineCodeRegex.exec(content);
  }

  // Function to check if a position is inside a code block
  const isInCodeBlock = (position: number): boolean => {
    return codeBlockRanges.some(
      (range) => position >= range.start && position <= range.end,
    );
  };

  // Regex to match standalone URLs (URLs that are on their own line)
  const standaloneUrlRegex = /^(https?:\/\/[^\s]+)$/gm;

  const result = content.replace(standaloneUrlRegex, (match, url, offset) => {
    // Check if this URL is inside a code block
    if (isInCodeBlock(offset)) {
      console.log("Skipping URL in code block:", url);
      return match; // Return original match without conversion
    }

    console.log("Found standalone URL:", url);
    // Convert standalone URL to a custom component marker
    return `<LinkCard url="${url}" />`;
  });

  return result;
}

// Utility to check if a URL is valid
export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Extract domain from URL for display
export function extractDomain(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return domain.replace("www.", "");
  } catch (_) {
    return url;
  }
}
