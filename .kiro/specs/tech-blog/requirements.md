# Requirements Document

## Introduction

This feature involves building a modern technical blog platform, designed for international audiences. The platform will allow publishing and managing technical articles in MDX format, with a focus on clean UI, search functionality, and modern web standards. Initially, the platform will support single-author publishing with the potential for future multi-user expansion.

## Requirements

### Requirement 1

**User Story:** As a blog author, I want to create and publish technical articles in MDX format, so that I can share my knowledge with an international audience using rich content formatting.

#### Acceptance Criteria

1. WHEN an author creates a new article THEN the system SHALL support MDX file format with frontmatter metadata
2. WHEN an article is created THEN the system SHALL require title, slug, publishedAt, updatedAt, tags, description, and thumbnail fields in frontmatter
3. WHEN an article includes images THEN the system SHALL store images in the same directory as the article MDX file
4. WHEN the site is built THEN the system SHALL copy article images to the public folder for serving

### Requirement 2

**User Story:** As a blog visitor, I want to browse a list of published articles with thumbnails and metadata, so that I can discover content that interests me.

#### Acceptance Criteria

1. WHEN a visitor accesses the blog homepage THEN the system SHALL display a list of all published articles
2. WHEN displaying articles THEN the system SHALL show title, description, thumbnail, publication date, and tags for each article
3. WHEN the site builds THEN the system SHALL generate a cached JSON file containing all article metadata for efficient loading
4. WHEN articles are sorted THEN the system SHALL order them by publication date (newest first)

### Requirement 3

**User Story:** As a blog visitor, I want to read individual articles with proper formatting and navigation, so that I can consume the technical content effectively.

#### Acceptance Criteria

1. WHEN a visitor clicks on an article THEN the system SHALL render the full MDX content with proper styling
2. WHEN an article loads THEN the system SHALL display the article title, publication date, tags, and content
3. WHEN rendering MDX THEN the system SHALL support code syntax highlighting, embedded components, and rich formatting
4. WHEN an article is accessed THEN the system SHALL generate proper OGP meta tags for social sharing

### Requirement 4

**User Story:** As a blog visitor, I want to search through articles by content and tags, so that I can quickly find relevant information.

#### Acceptance Criteria

1. WHEN a visitor uses the search function THEN the system SHALL provide client-side full-text search using FlexSearch
2. WHEN searching THEN the system SHALL search through article titles, descriptions, content, and tags
3. WHEN search results are displayed THEN the system SHALL highlight matching terms and show relevant snippets
4. WHEN the site builds THEN the system SHALL generate a search index for all published articles

### Requirement 5

**User Story:** As a blog visitor, I want to filter articles by tags, so that I can explore content within specific technology areas.

#### Acceptance Criteria

1. WHEN a visitor clicks on a tag THEN the system SHALL display all articles associated with that tag
2. WHEN tags are displayed THEN the system SHALL show tag names with associated icons
3. WHEN the system loads THEN the system SHALL read tag definitions from a centralized tags.json configuration file
4. WHEN a tag page loads THEN the system SHALL display the tag name, icon, and filtered article list

### Requirement 6

**User Story:** As a blog visitor, I want to switch between light and dark themes, so that I can read content in my preferred visual mode.

#### Acceptance Criteria

1. WHEN a visitor toggles the theme THEN the system SHALL switch between light and dark modes using Tailwind CSS
2. WHEN the page loads THEN the system SHALL respect the user's OS theme preference as the default
3. WHEN a theme is selected THEN the system SHALL persist the user's preference in local storage
4. WHEN switching themes THEN the system SHALL apply the theme to all UI components and article content

### Requirement 7

**User Story:** As a blog author, I want articles to have proper SEO and social media integration, so that content can be effectively discovered and shared.

#### Acceptance Criteria

1. WHEN an article is accessed THEN the system SHALL generate appropriate meta tags for SEO
2. WHEN an article is shared THEN the system SHALL provide proper OGP tags with title, description, and thumbnail
3. WHEN generating meta tags THEN the system SHALL use server-side rendering on Cloudflare Workers
4. WHEN a thumbnail is specified THEN the system SHALL use the article's custom thumbnail for OGP images

### Requirement 8

**User Story:** As a blog author, I want to organize articles in a structured file system, so that content management is intuitive and scalable.

#### Acceptance Criteria

1. WHEN creating an article THEN the system SHALL use the directory structure: `/contents/blog/slug-name/index.mdx`
2. WHEN adding images THEN the system SHALL store them in the same directory as the article
3. WHEN the site builds THEN the system SHALL automatically discover all articles in the contents directory
4. WHEN articles are processed THEN the system SHALL validate required frontmatter fields and file structure