import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Search, X } from 'lucide-react';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import {
  createDocumentIndex,
  performSearch,
  type SearchResult,
  type SearchIndex
} from '~/lib/blog/search-index';

interface SearchBoxProps {
  className?: string;
  placeholder?: string;
  showSuggestions?: boolean;
}

export function SearchBox({
  className = '',
  placeholder = 'Search articles...',
  showSuggestions = true
}: SearchBoxProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
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
        const response = await fetch('/search-index.json');
        if (response.ok) {
          const index = await response.json() as SearchIndex;
          setSearchIndex(index);
        } else {
          console.warn('Search index not available:', response.status);
        }
      } catch (error) {
        console.error('Failed to load search index:', error);
      }
    };

    loadSearchIndex();
  }, []);

  // Update query when URL search params change
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

  // Debounced search for suggestions
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!query.trim() || !searchIndex || !showSuggestions) {
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
            tags: article.tags.join(' '),
          });
        }

        // Get suggestions (limit to 5 for dropdown)
        const results = performSearch(index, searchIndex.articles, query, 5);
        setSuggestions(results);
        setShowSuggestionsList(results.length > 0);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Suggestion search error:', error);
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
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          navigate(`/blog/${suggestions[selectedIndex].slug}`);
          setShowSuggestionsList(false);
          inputRef.current?.blur();
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
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
    setQuery('');
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
        <form action="/search" method="get" className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            name="q"
            placeholder={placeholder}
            defaultValue={query}
            className="pl-10 pr-20"
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-3"
          >
            Search
          </Button>
        </form>
      </noscript>

      {/* JavaScript-enhanced search */}
      <div className="js-only relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Suggestions dropdown - JavaScript only */}
      {showSuggestionsList && (
        <Card
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto"
        >
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            ) : suggestions.length > 0 ? (
              <div className="py-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.slug}
                    onClick={() => handleSuggestionClick(suggestion.slug)}
                    className={`w-full text-left px-4 py-3 hover:bg-muted transition-colors ${index === selectedIndex ? 'bg-muted' : ''
                      }`}
                  >
                    <div className="space-y-1">
                      <div
                        className="font-medium text-sm"
                        dangerouslySetInnerHTML={{
                          __html: suggestion.highlights.title || suggestion.title
                        }}
                      />
                      <div
                        className="text-xs text-muted-foreground line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: suggestion.highlights.description || suggestion.description
                        }}
                      />
                      {suggestion.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {suggestion.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {suggestion.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{suggestion.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                ))}

                {/* Show all results link */}
                <div className="border-t mt-2 pt-2">
                  <button
                    onClick={handleSearch}
                    className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-muted transition-colors"
                  >
                    See all results for "{query}"
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No suggestions found
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}