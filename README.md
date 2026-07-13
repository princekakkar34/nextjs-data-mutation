# NextPosts - Next.js Data Mutation Demo

A modern social media feed application demonstrating server actions, data mutations, and optimistic UI updates in Next.js 16+ with React 19. Browse and share posts with real-time like functionality, image uploads, and SQLite database persistence.

## Stack

- **Language(s):** TypeScript (79.6%), CSS (19.8%), JavaScript (0.6%)
- **Framework / Runtime:** Next.js 16.2.10 with App Router, React 19.2.7
- **Notable Libraries:**
  - `better-sqlite3` (^12.11.1) — SQLite database for persistent storage
  - `cloudinary` (^2.10.0) — Image upload and hosting service
  - `react` (^19.2.7) — Modern React with concurrent features
  - Next.js server actions and `useOptimistic` hook for mutations

## How It's Organized

```
app/                    Next.js App Router pages and layouts
  layout.tsx            Root layout with header and global styling
  page.tsx              Home page showing recent posts
  feed/
    page.tsx            Full feed page with all posts
    loading.tsx         Loading fallback for feed
    error.tsx           Error boundary for feed
  new-post/
    page.tsx            Create new post page

components/             React components (UI building blocks)
  header.tsx            Navigation header with logo and links
  posts.tsx             Posts list with optimistic update logic
  post-form.tsx         Form component for creating new posts
  like-icon.tsx         Heart icon button for liking posts
  form-submit.tsx       Submit button with loading state

lib/                    Business logic and utilities
  posts.ts              SQLite queries, database schema, POST type
  format.ts             Date formatting utility
  cloudinary.ts         Image upload handler with Cloudinary config

actions/                Server Actions (mutation handlers)
  posts.ts              createPost, toggleLikePostStatus

public/                 Static assets (favicon, etc.)
assets/                 Logo image for header
.vscode/                VS Code workspace settings
```

### How It Fits Together

The application follows a client-server pattern with **Next.js Server Actions** for mutations:

1. **Home & Feed Pages** — Render posts server-side using `getPosts()` from the SQLite database
2. **Create Post Flow** — Form submission triggers `createPost()` server action → validates → uploads image to Cloudinary → stores post in DB → redirects to `/feed`
3. **Like Interaction** — Client-side form submission with `useOptimistic()` immediately updates UI while `toggleLikePostStatus()` server action updates the database in the background
4. **Database** — SQLite with three tables (users, posts, likes); initialized on app start with two demo users

The UI uses `Suspense` for loading states and React 19's `useOptimistic` hook to provide instant UI feedback while server operations complete.

## How to Run It

### Prerequisites

- Node.js 18+
- Cloudinary account with API credentials
- `npm` or `yarn` package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/princekakkar34/nextjs-data-mutation.git
cd nextjs-data-mutation

# Install dependencies
npm install
# or
yarn install
```

### Environment Setup

Create a `.env.local` file in the root directory with your Cloudinary credentials:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Development

```bash
# Start the development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

### Other Commands

```bash
# Lint the code
npm run lint

# Type checking (via TypeScript)
tsc --noEmit
```

## Features

- **Browse Posts** — View feed of all posts with user names and timestamps
- **Create Posts** — Upload images via Cloudinary, add title and content
- **Like Posts** — Optimistic UI updates with server-side persistence
- **Recent Posts Widget** — Home page shows 2 most recent posts with Suspense fallback
- **Form Validation** — Server-side validation with error display
- **Responsive Design** — Dark-themed UI with modern styling
- **Type Safety** — Full TypeScript coverage with strict mode enabled

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT
)
```

### Posts Table
```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY,
  image_url TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
)
```

### Likes Table
```sql
CREATE TABLE likes (
  user_id INTEGER,
  post_id INTEGER,
  PRIMARY KEY(user_id, post_id),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
)
```

## Key Concepts Demonstrated

### Server Actions
- `createPost()` — Validates form data, uploads image, stores post
- `toggleLikePostStatus()` — Updates like status in database and revalidates cache

### Optimistic Updates
- `useOptimistic()` hook in `components/posts.tsx` — UI updates immediately while server action completes
- Fallback to server response if action fails

### Streaming & Suspense
- `Suspense` component on home page for loading states
- Server-side rendering with async components

### Image Handling
- Cloudinary integration for image uploads
- Base64 encoding of files for cloud storage
- Automatic folder organization

## Development Notes

- Database file (`posts.db`) is created automatically on first run with SQLite
- Demo users (John Doe, Max Schwarz) are seeded if database is empty
- Currently hardcoded to userId 1 for post creation and userId 2 for likes (can be made dynamic)
- Timestamps have 1-second artificial delay to simulate network latency
- All components use TypeScript for type safety

## Project Status

This is a learning/demo project showcasing Next.js 16 and React 19 features. Created 3 days ago.

## License

MIT (no license file present)

## Questions or Issues?

Feel free to open an issue on GitHub for bug reports or feature requests.
