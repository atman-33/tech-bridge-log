// Utility to detect standalone URLs and convert them to link card components
export function processLinkCards(content: string): string {
  // Regex to match standalone URLs (URLs that are on their own line)
  const standaloneUrlRegex = /^(https?:\/\/[^\s]+)$/gm;

  return content.replace(standaloneUrlRegex, (match, url) => {
    // Convert standalone URL to a custom component marker
    return `<LinkCard url="${url}" />`;
  });
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
