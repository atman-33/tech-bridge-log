# Tech Bridge Log

A modern tech blog platform built with React Router v7, Cloudflare Workers, and D1 database. Features a complete blog infrastructure with MDX support, authentication, search functionality, and a responsive design.

## Features

### Core Technology Stack
- **Framework**: [React Router v7](https://reactrouter.com/) with SSR
- **Platform**: [Cloudflare Workers](https://workers.cloudflare.com/) + [D1 Database](https://developers.cloudflare.com/d1/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) with type-safe queries
- **Authentication**: [better-auth](https://www.better-auth.com/) with GitHub & Google OAuth
- **UI/Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Content**: MDX support with frontmatter validation
- **Tooling**: [Vite](https://vitejs.dev/), [Biome](https://biomejs.dev/), [TypeScript](https://www.typescriptlang.org/)

### Blog Platform Features
- 📝 **MDX Blog System**: Write articles in MDX with React component support
- 🔍 **Full-text Search**: FlexSearch integration for fast article search
- 🏷️ **Tag System**: Organize and filter articles by tags
- 📱 **Responsive Design**: Mobile-first responsive layout
- 🌙 **Dark Mode**: Theme switching with next-themes
- 📊 **Reading Progress**: Visual reading progress indicator
- 🔗 **Table of Contents**: Auto-generated TOC for articles
- 📈 **Reading Time**: Automatic reading time calculation
- 🎨 **Emoji Icons**: Visual article representation with emoji icons
- 🔐 **Authentication**: Secure login with GitHub and Google OAuth

## Getting Started

### 1. Installation

Install the dependencies:

```bash
npm install
```

### 2. Environment Variables

Copy the example environment file to both `.dev.vars` (for local development with Wrangler) and `.env` (for other scripts like Drizzle Kit).

```bash
cp .env.example .dev.vars
cp .env.example .env
```

Be sure to fill in the required variables in both files.

### 3. Database Setup

Run the initial database migrations for your local D1 database.

```bash
# Generate the auth schema
npm run auth:db:generate

# Migrate the main schema
npm run db:migrate
```

### 4. Blog Content Setup

Create your first blog article:

```bash
# Create article directory
mkdir -p contents/blog/my-first-article

# Create the article file
touch contents/blog/my-first-article/index.mdx
```

Add frontmatter and content to your article:

```mdx
---
title: "My First Article"
slug: "my-first-article"
publishedAt: "2024-01-15T10:00:00Z"
updatedAt: "2024-01-15T10:00:00Z"
tags: ["getting-started", "blog"]
description: "This is my first article on the tech blog"
emoji: "🚀"
---

# Welcome to my blog!

This is the content of my first article.
```

### 5. Start Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Available Scripts

### Development
- `dev`: Starts the development server with HMR and blog build
- `build`: Creates a production-ready build (includes blog build)
- `preview`: Serves the production build locally for previewing
- `deploy`: Builds and deploys your application to Cloudflare

### Blog Management
- `blog:build`: Processes MDX articles and generates blog metadata cache

### Database
- `db:generate`: Generates Drizzle ORM migration files based on schema changes
- `db:migrate`: Applies pending migrations to the local D1 database
- `db:migrate-production`: Applies pending migrations to the production D1 database
- `auth:db:generate`: Generates the database schema for `better-auth`

### Code Quality
- `check`: Runs type checking and Biome for code quality
- `biome:check`: Lints and formats the codebase using Biome
- `typecheck`: Runs TypeScript type checking with Cloudflare types
- `test`: Runs tests using Vitest

### Utilities
- `cf-typegen`: Generates Cloudflare Worker types
- `prepare`: Sets up Husky git hooks

## Blog Content Management

### Article Structure

Articles are stored in `contents/blog/` with the following structure:

```
contents/blog/
├── article-slug/
│   ├── index.mdx          # Article content with frontmatter
│   └── other-assets.*     # Additional images/assets (optional)
└── ...
```

### Frontmatter Schema

Each article requires the following frontmatter:

```yaml
---
title: "Article Title"                    # Required
slug: "article-slug"                      # Required, must match directory name
publishedAt: "2024-01-15T10:00:00Z"      # Required, ISO 8601 format
updatedAt: "2024-01-15T10:00:00Z"        # Required, ISO 8601 format
tags: ["tag1", "tag2", "tag3"]           # Required, array of strings
description: "Brief description"          # Required
emoji: "🚀"                              # Required, single emoji character
---
```

### Build Process

The blog build process:
1. Discovers all MDX files in `contents/blog/`
2. Validates frontmatter for each article (including emoji validation)
3. Copies assets to `public/blog-assets/` (if any)
4. Generates `public/blog-metadata.json` cache
5. Compiles MDX content for rendering

## Deployment

Deployment is done using the Wrangler CLI.

### 1. Create Production D1 Database

First, create a D1 database in your Cloudflare account.

```bash
npx wrangler d1 create <your-database-name>
```

### 2. Configure Wrangler

Update your `wrangler.jsonc` file with the `database_name` and `database_id` from the previous step.

```jsonc
// wrangler.jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "<your-database-name>",
    "database_id": "<your-database-id>"
  }
]
```

### 3. Run Production Migration

Update your `drizzle.config.ts` to point to your production database, and then run the production migration command:

```bash
npm run db:migrate-production
```

### 4. Deploy to Cloudflare

To build and deploy your application to production:

```bash
npm run deploy
```

## Authentication

This application uses [`better-auth`](https://www.better-auth.com/) for authentication with GitHub and Google OAuth providers. Key files include:

- `auth.ts`: Main `better-auth` CLI configuration
- `app/lib/auth/auth.server.ts`: Server-side authentication utilities
- `app/lib/auth/auth-client.ts`: Client-side authentication utilities
- `app/routes/api.auth.$/`: Route for handling authentication callbacks

### Environment Variables for Auth

```bash
BETTER_AUTH_SECRET=your-secret-key
OAUTH_GITHUB_CLIENT_ID=your-github-client-id
OAUTH_GITHUB_CLIENT_SECRET=your-github-client-secret
OAUTH_GOOGLE_CLIENT_ID=your-google-client-id
OAUTH_GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Styling

This application comes with [Tailwind CSS v4](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/) for a modern, component-based styling experience.

To add new `shadcn/ui` components, you can use their CLI:

```bash
npx shadcn-ui@latest add <component-name>
```

## Project Structure

```
├── app/                          # React Router application
│   ├── components/ui/            # shadcn/ui components
│   ├── lib/                      # Utility libraries
│   │   ├── auth/                 # Authentication utilities
│   │   └── blog/                 # Blog infrastructure
│   └── routes/                   # File-based routing
├── contents/blog/                # Blog articles (MDX)
├── database/                     # Database schema
├── public/                       # Static assets
├── workers/                      # Cloudflare Worker entry
├── auth.ts                       # better-auth CLI config
├── drizzle.config.ts            # Database ORM config
├── react-router.config.ts       # Framework config
└── wrangler.jsonc               # Cloudflare config
```

## Key Features

### Search Functionality
- Full-text search across all articles using FlexSearch
- Search by title, content, and tags
- Real-time search results with highlighting

### Tag System
- Organize articles with multiple tags
- Tag-based filtering and navigation
- Tag cloud visualization

### Reading Experience
- Reading progress indicator
- Auto-generated table of contents
- Estimated reading time
- Related articles suggestions
- Mobile-optimized reading layout

### Performance
- Server-side rendering with React Router v7
- Edge deployment on Cloudflare Workers
- Optimized asset delivery
- Build-time article processing

---

Built with ❤️ using React Router v7 and Cloudflare.