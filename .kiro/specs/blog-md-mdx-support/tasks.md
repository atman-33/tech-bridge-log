# Implementation Plan

- [x] 1. Update file discovery patterns to support both .mdx and .md extensions
  - Modify the `import.meta.glob` pattern in `app/lib/blog/mdx-processor.ts` to include both `/contents/blog/**/index.mdx` and `/contents/blog/**/index.md`
  - Update the `mdxModules` object to merge both glob patterns
  - _Requirements: 2.1, 2.2_

- [ ] 2. Implement file resolution priority logic
  - Create a `resolveArticleFile()` helper function that checks for both extensions with .mdx priority
  - Update the `discoverArticles()` function to use the new resolution logic
  - Ensure Node.js environment file system scanning checks for both extensions
  - _Requirements: 1.3, 2.1_

- [ ] 3. Update content loading to handle both file formats
  - Modify `loadArticleContent()` function to use the new file resolution logic
  - Update both Vite environment (import.meta.glob) and Node.js environment (file system) code paths
  - Ensure static content fetching works for both formats
  - _Requirements: 2.3, 4.2_

- [ ] 4. Update article processing pipeline for dual format support
  - Modify `processArticle()` function to work with resolved file paths of either extension
  - Ensure frontmatter validation works identically for both .md and .mdx files
  - Update error messages to indicate the actual file extension being processed
  - _Requirements: 3.1, 3.2_

- [ ] 5. Update build script to process both file types
  - Modify `scripts/build-blog.ts` to handle articles from both .md and .mdx files
  - Ensure static content generation in `public/blog-content/` works for both formats
  - Update MDX file generation to maintain .mdx extension in output regardless of source format
  - _Requirements: 4.1, 4.3_

- [ ] 6. Update image processing to handle both file formats
  - Modify `app/lib/blog/image-processor.ts` to exclude both `index.mdx` and `index.md` from image processing
  - Ensure image discovery works correctly regardless of article file extension
  - _Requirements: 5.3_

- [ ] 7. Add comprehensive unit tests for dual format support
  - Create tests for file discovery with .mdx files only, .md files only, and mixed formats
  - Add tests for priority resolution when both formats exist for the same article
  - Test content loading for both file formats
  - Test frontmatter validation consistency across formats
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 8. Add integration tests for build and runtime scenarios
  - Test complete build process with .mdx files only, .md files only, and mixed formats
  - Test static asset generation for both formats
  - Test article loading in both development and production modes
  - Test search functionality with mixed formats
  - _Requirements: 4.4, 2.4_

- [ ] 9. Add migration tests for format conversion
  - Test converting existing .mdx files to .md format
  - Verify metadata consistency after format conversion
  - Test that images and assets continue to work after conversion
  - Verify build process succeeds after format conversion
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 10. Update documentation and add logging improvements
  - Add informative logging when both formats exist for the same article
  - Update error messages to be more descriptive about file format issues
  - Add console warnings for potential format conflicts
  - _Requirements: 1.3, 2.1_