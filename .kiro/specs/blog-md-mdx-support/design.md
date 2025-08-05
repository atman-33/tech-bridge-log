# Design Document

## Overview

This design extends the existing blog system to support both `.mdx` and `.md` file formats for blog articles. The current system is hardcoded to only process `.mdx` files through several key components: file discovery, content loading, and static asset generation. The solution involves updating these components to handle both file extensions while maintaining backward compatibility and prioritizing `.mdx` files when both formats exist for the same article.

## Architecture

The blog system consists of several key components that need modification:

1. **File Discovery System** (`discoverArticles()` function)
2. **Content Loading System** (`loadArticleContent()` function) 
3. **Article Processing Pipeline** (`processArticle()` function)
4. **Static Asset Generation** (build script)
5. **Import Pattern Definitions** (`import.meta.glob` patterns)

The architecture will remain the same, but each component will be enhanced to handle both file extensions with a priority system favoring `.mdx` over `.md`.

## Components and Interfaces

### 1. File Discovery Enhancement

**Current Implementation:**
- Uses `import.meta.glob("/contents/blog/**/index.mdx")` for Vite environment
- Scans for `index.mdx` files in Node.js environment

**New Implementation:**
- Extend `import.meta.glob` to include both patterns: `index.mdx` and `index.md`
- Update Node.js file system scanning to check for both extensions
- Implement priority logic: if both `index.mdx` and `index.md` exist, prefer `.mdx`

```typescript
// New import pattern
const mdxModules = typeof import.meta.glob !== "undefined"
  ? {
      ...import.meta.glob("/contents/blog/**/index.mdx", { query: "?raw", import: "default" }),
      ...import.meta.glob("/contents/blog/**/index.md", { query: "?raw", import: "default" })
    }
  : {};
```

### 2. Content Loading Enhancement

**Current Implementation:**
- Hardcoded to look for `.mdx` files
- Uses specific file paths like `/contents/blog/${slug}/index.mdx`

**New Implementation:**
- Create a file resolution function that checks for both extensions
- Implement priority logic in content loading
- Update static content fetching to handle both formats

```typescript
// New file resolution logic
function resolveArticleFile(slug: string): string | null {
  const mdxPath = `/contents/blog/${slug}/index.mdx`;
  const mdPath = `/contents/blog/${slug}/index.md`;
  
  // Check if MDX exists first (priority)
  if (mdxModules[mdxPath]) return mdxPath;
  if (mdxModules[mdPath]) return mdPath;
  
  return null;
}
```

### 3. Processing Pipeline Enhancement

**Current Implementation:**
- Single processing path for `.mdx` files
- Frontmatter validation and content extraction

**New Implementation:**
- Unified processing for both file types
- Same frontmatter validation rules apply to both formats
- Content extraction works identically for both formats (using gray-matter)

### 4. Static Asset Generation Enhancement

**Current Implementation:**
- Generates `.mdx` files in `public/blog-content/`
- Build script processes only `.mdx` files

**New Implementation:**
- Generate unified output format regardless of source extension
- Maintain `.mdx` extension in output for consistency
- Update build script to process both file types

## Data Models

No changes to existing data models are required. The `ArticleMetadata` interface and related types remain unchanged since both `.md` and `.mdx` files will use the same frontmatter structure and validation rules.

```typescript
// Existing interface remains unchanged
interface ArticleMetadata {
  slug: string;
  title: string;
  description: string;
  publishedAt: Date;
  updatedAt: Date;
  tags: string[];
  emoji: string;
  readingTime: number;
}
```

## Error Handling

### File Resolution Errors
- When neither `.md` nor `.mdx` exists for a slug, return null/404 as before
- Log warnings when both formats exist (indicating potential confusion)
- Graceful fallback from `.mdx` to `.md` if `.mdx` fails to load

### Processing Errors
- Same validation rules apply to both formats
- Error messages should indicate the actual file extension being processed
- Build process should continue if one format fails but the other succeeds

### Runtime Errors
- Static content fetching should handle both formats transparently
- Cache generation should include articles from both formats
- Search indexing should work identically for both formats

## Testing Strategy

### Unit Tests
1. **File Discovery Tests**
   - Test discovery of `.mdx` files only
   - Test discovery of `.md` files only  
   - Test discovery of mixed formats
   - Test priority logic when both formats exist

2. **Content Loading Tests**
   - Test loading `.mdx` content
   - Test loading `.md` content
   - Test priority resolution
   - Test error handling for missing files

3. **Processing Pipeline Tests**
   - Test frontmatter validation for both formats
   - Test content extraction for both formats
   - Test metadata generation consistency

### Integration Tests
1. **Build Process Tests**
   - Test complete build with `.mdx` files only
   - Test complete build with `.md` files only
   - Test complete build with mixed formats
   - Test static asset generation for both formats

2. **Runtime Tests**
   - Test article loading in development mode
   - Test article loading in production mode
   - Test search functionality with mixed formats
   - Test navigation between articles of different formats

### Migration Tests
1. **Format Conversion Tests**
   - Test converting existing `.mdx` to `.md`
   - Test that metadata remains consistent after conversion
   - Test that images and assets continue to work
   - Test that build process succeeds after conversion

## Implementation Phases

### Phase 1: Core File Discovery
- Update `import.meta.glob` patterns to include both extensions
- Modify `discoverArticles()` function for dual format support
- Implement file resolution priority logic

### Phase 2: Content Loading Enhancement  
- Update `loadArticleContent()` to handle both formats
- Modify `processArticle()` to work with resolved file paths
- Update error handling and logging

### Phase 3: Build Process Updates
- Modify build script to process both file types
- Update static content generation
- Ensure cache generation includes both formats

### Phase 4: Testing and Validation
- Add comprehensive test coverage
- Test migration scenarios
- Validate performance impact

## Performance Considerations

- **File Discovery**: Minimal impact as we're adding one additional glob pattern
- **Content Loading**: No performance impact as resolution happens once per article
- **Build Time**: Slight increase due to additional file system checks, but negligible
- **Runtime**: No impact as static content is pre-generated
- **Memory Usage**: Minimal increase due to additional module mappings

## Security Considerations

- Both `.md` and `.mdx` files use the same content processing pipeline
- Same sanitization rules apply to both formats
- No additional security risks introduced
- Frontmatter validation remains consistent across formats

## Backward Compatibility

- Existing `.mdx` files continue to work without changes
- No breaking changes to APIs or interfaces
- Build process remains compatible with existing workflows
- Migration from `.mdx` to `.md` is non-breaking (rename operation)