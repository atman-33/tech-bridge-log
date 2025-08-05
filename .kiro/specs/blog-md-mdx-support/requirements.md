# Requirements Document

## Introduction

This feature extends the existing blog system to support both `.mdx` and `.md` file formats for blog articles, instead of only supporting `.mdx` files. This change is needed to avoid build errors that can occur with MDX files and provide more flexibility for content creation.

## Requirements

### Requirement 1

**User Story:** As a content creator, I want to write blog articles in either `.mdx` or `.md` format, so that I can choose the most appropriate format for my content and avoid potential build errors.

#### Acceptance Criteria

1. WHEN a blog article is created with `.md` extension THEN the system SHALL process it the same way as `.mdx` files
2. WHEN a blog article is created with `.mdx` extension THEN the system SHALL continue to process it as before
3. WHEN both `.md` and `.mdx` files exist for the same article THEN the system SHALL prioritize `.mdx` over `.md`
4. WHEN the build process runs THEN it SHALL discover both `.md` and `.mdx` files in the blog content directory

### Requirement 2

**User Story:** As a developer, I want the file discovery system to automatically detect both `.md` and `.mdx` files, so that the build process works seamlessly regardless of file extension.

#### Acceptance Criteria

1. WHEN the `discoverArticles()` function runs THEN it SHALL scan for both `index.md` and `index.mdx` files
2. WHEN the `import.meta.glob` pattern is used THEN it SHALL include both `.md` and `.mdx` extensions
3. WHEN processing articles during build THEN the system SHALL handle both file types with the same frontmatter validation
4. WHEN generating the article cache THEN both `.md` and `.mdx` articles SHALL be included

### Requirement 3

**User Story:** As a content creator, I want the same frontmatter format and validation to work for both `.md` and `.mdx` files, so that I can migrate between formats without changing my content structure.

#### Acceptance Criteria

1. WHEN a `.md` file is processed THEN it SHALL use the same frontmatter validation as `.mdx` files
2. WHEN a `.md` file is processed THEN it SHALL support the same frontmatter fields (title, slug, publishedAt, updatedAt, tags, description, emoji)
3. WHEN content is loaded at runtime THEN both `.md` and `.mdx` files SHALL be accessible through the same API
4. WHEN the search index is built THEN both `.md` and `.mdx` content SHALL be included

### Requirement 4

**User Story:** As a developer, I want the static content generation to work for both file types, so that the runtime performance remains optimal.

#### Acceptance Criteria

1. WHEN the build script runs THEN it SHALL generate static content files for both `.md` and `.mdx` articles
2. WHEN static content is generated THEN both file types SHALL be converted to the same output format
3. WHEN the public blog-content directory is created THEN it SHALL contain processed content from both `.md` and `.mdx` files
4. WHEN content is served at runtime THEN the file extension SHALL not affect the user experience

### Requirement 5

**User Story:** As a content creator, I want to be able to convert existing `.mdx` files to `.md` files, so that I can avoid build errors when needed.

#### Acceptance Criteria

1. WHEN an existing `.mdx` file is renamed to `.md` THEN the system SHALL continue to process it correctly
2. WHEN the frontmatter remains unchanged during conversion THEN the article SHALL maintain all its metadata
3. WHEN images and assets are referenced in the content THEN they SHALL continue to work after format conversion
4. WHEN the build process runs after conversion THEN it SHALL not produce any errors