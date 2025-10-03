import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  createDocumentIndex,
  performSearch,
  type SearchIndex,
  type SearchResult,
} from "~/lib/blog/search-index";

type SearchBoxProps = {
  className?: string;
  placeholder?: string;
  showSuggestions?: boolean;
};

export function SearchBox({
  className = "",
  placeholder = "Search articles...",
  showSuggestions = true,
}: SearchBoxProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchIndex, setSearchIndex] = useState<SearchIndex | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load search index on component mount
  useEffect(() => {
    const loadSearchIndex = async () => {
      try {
        const response = await fetch("/search-index.json");
        if (response.ok) {
          const index = (await response.json()) as SearchIndex;
          setSearchIndex(index);
        } else {
          console.warn("Search index not available:", response.status);
        }
      } catch (error) {
        console.error("Failed to load search index:", error);
      }
    };

    loadSearchIndex();
  }, []);

  // Update query when URL search params change
  // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  // Debounced search for suggestions
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!(query.trim() && searchIndex && showSuggestions)) {
      setSuggestions([]);
      setShowSuggestionsList(false);
      return;
    }

    setIsLoading(true);

    timeoutRef.current = setTimeout(() => {
      try {
        const index = createDocumentIndex();

        // Add articles to the index
        for (const article of searchIndex.articles) {
          index.add({
            slug: article.slug,
            title: article.title,
            description: article.description,
            content: article.content,
            tags: article.tags.join(" "),
          });
        }

        // Get suggestions (limit to 5 for dropdown)
        const results = performSearch(index, searchIndex.articles, query, 5);
        setSuggestions(results);
        setShowSuggestionsList(results.length > 0);
        setSelectedIndex(-1);
      } catch (error) {
        console.error("Suggestion search error:", error);
        setSuggestions([]);
        setShowSuggestionsList(false);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, searchIndex, showSuggestions]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestionsList || suggestions.length === 0) {
      if (e.key === "Enter") {
        handleSearch();
      }
      return;
    }

    // biome-ignore lint/style/useDefaultSwitchClause: ignore
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          navigate(`/blog/${suggestions[selectedIndex].slug}`);
          setShowSuggestionsList(false);
          inputRef.current?.blur();
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        setShowSuggestionsList(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestionsList(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (slug: string) => {
    navigate(`/blog/${slug}`);
    setShowSuggestionsList(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestionsList(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0 && query.trim()) {
      setShowSuggestionsList(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestionsList(false);
      setSelectedIndex(-1);
    }, 200);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Fallback form for users without JavaScript */}
      <noscript>
        <form action="/search" className="relative" method="get">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
          <Input
            className="pr-20 pl-10"
            defaultValue={query}
            name="q"
            placeholder={placeholder}
            type="text"
          />
          <Button
            className="-translate-y-1/2 absolute top-1/2 right-1 h-8 transform px-3"
            size="sm"
            type="submit"
          >
            Search
          </Button>
        </form>
      </noscript>

      {/* JavaScript-enhanced search */}
      <div className="js-only relative">
        <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
        <Input
          className="pr-10 pl-10"
          onBlur={handleInputBlur}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          ref={inputRef}
          type="text"
          value={query}
        />
        {query && (
          <Button
            className="-translate-y-1/2 absolute top-1/2 right-1 h-8 w-8 transform p-0"
            onClick={handleClear}
            size="sm"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Suggestions dropdown - JavaScript only */}
      {showSuggestionsList && (
        <Card
          className="absolute top-full right-0 left-0 z-50 mt-1 max-h-96 overflow-y-auto"
          ref={suggestionsRef}
        >
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                Searching...
              </div>
              // biome-ignore lint/style/noNestedTernary: ignore
            ) : suggestions.length > 0 ? (
              <div className="py-2">
                {suggestions.map((suggestion, index) => (
                  // biome-ignore lint/a11y/useButtonType: ignore
                  <button
                    className={`w-full px-4 py-3 text-left transition-colors hover:bg-muted ${
                      index === selectedIndex ? "bg-muted" : ""
                    }`}
                    key={suggestion.slug}
                    onClick={() => handleSuggestionClick(suggestion.slug)}
                  >
                    <div className="space-y-1">
                      <div
                        className="font-medium text-sm"
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: ignore
                        dangerouslySetInnerHTML={{
                          __html:
                            suggestion.highlights.title || suggestion.title,
                        }}
                      />
                      <div
                        className="line-clamp-2 text-muted-foreground text-xs"
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: ignore
                        dangerouslySetInnerHTML={{
                          __html:
                            suggestion.highlights.description ||
                            suggestion.description,
                        }}
                      />
                      {suggestion.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {suggestion.tags.slice(0, 3).map((tag) => (
                            <Badge
                              className="text-xs"
                              key={tag}
                              variant="secondary"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {suggestion.tags.length > 3 && (
                            <Badge className="text-xs" variant="secondary">
                              +{suggestion.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                ))}

                {/* Show all results link */}
                <div className="mt-2 border-t pt-2">
                  <button
                    className="w-full px-4 py-2 text-left text-primary text-sm transition-colors hover:bg-muted"
                    onClick={handleSearch}
                    type="button"
                  >
                    See all results for "{query}"
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No suggestions found
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
