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
npm build

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

---

## 📚 Next.js Concepts & Interview Guide

This section breaks down all Next.js concepts used in this project with detailed explanations and code examples.

### 1. **App Router & File-Based Routing**

**What it is:** Next.js 13+ uses the `app/` directory for file-based routing. Each folder represents a route segment.

**Files in this project:**
- `app/page.tsx` → Route: `/` (home page)
- `app/feed/page.tsx` → Route: `/feed`
- `app/new-post/page.tsx` → Route: `/new-post`

**Interview Tips:**
- App Router replaces the older `pages/` directory
- Supports nested routes through folder structure
- `page.tsx` is the entry point for a route
- `layout.tsx` wraps multiple routes with shared UI

**Example from project:**
```
app/
  layout.tsx           (Root layout - wraps all pages)
  page.tsx             (Home page "/" )
  feed/
    page.tsx           (Feed page "/feed")
    loading.tsx        (Loading UI for "/feed")
    error.tsx          (Error boundary for "/feed")
```

---

### 2. **Layout Files (`layout.tsx`)**

**What it is:** Layouts create shared UI that persists across route changes. They improve performance by avoiding full page re-renders.

**Code in this project (`app/layout.tsx`):**
```tsx
export const metadata = {
  title: 'NextPosts',
  description: 'Browse and share amazing posts.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />        {/* Renders on every page */}
        <main>{children}</main>  {/* Page content changes, header stays */}
      </body>
    </html>
  );
}
```

**Key Concepts:**
- `metadata` — Static metadata for SEO (replaces `next/head`)
- Layouts don't re-render when navigating between pages using the same layout
- Nested layouts create hierarchy (root layout wraps all, then route-specific layouts)

**Interview Tips:**
- Layouts improve performance by only rendering changed content
- Use metadata for SEO optimization
- Every app needs a root layout in `app/layout.tsx`

---

### 3. **Server Components (Default)**

**What it is:** In Next.js 13+, components are **server components by default** unless you add `'use client'`.

**Files in this project:**
- ✅ `app/page.tsx` — Server component (no `'use client'`)
- ✅ `app/feed/page.tsx` — Server component
- ✅ `lib/posts.ts` — Server-side functions
- ❌ `components/posts.tsx` — Client component (`'use client'` added)
- ❌ `components/post-form.tsx` — Client component (`'use client'` added)

**Benefits:**
- Smaller bundle size (JS stays on server)
- Direct database access without API layer
- Better security (API keys never exposed to client)

**Example from project (`app/feed/page.tsx` - Server Component):**
```tsx
import Posts from '@/components/posts';
import { getPosts } from '@/lib/posts';

export default async function FeedPage() {
  // ✅ Can directly call database functions
  const posts = await getPosts();
  
  return (
    <>
      <h1>All posts by all users</h1>
      <Posts posts={posts} />
    </>
  );
}
```

**Interview Tips:**
- Server components can fetch data, access databases, use environment variables
- Cannot use React hooks like `useState`, `useEffect`, event listeners
- Server components automatically serialize data passed to client components

---

### 4. **Client Components (`'use client'`)**

**What it is:** Add `'use client'` directive at the top to make a component client-side. Needed for interactivity.

**Files in this project:**
```tsx
// components/posts.tsx - Client Component
'use client';

import { useOptimistic } from 'react';
import { toggleLikePostStatus } from '@/actions/posts';

export default function Posts({ posts }: { posts: POST[] }) {
  // ✅ Can use React hooks
  const [optimisticPosts, updateOptimisticPosts] = useOptimistic(posts, ...);
  
  // ✅ Can attach event handlers
  async function updatePost(postId: number) {
    updateOptimisticPosts(postId);
    await toggleLikePostStatus(postId);
  }
  
  return <ul className="posts">...</ul>;
}
```

**Why needed?**
- Interactive components need `useState`, `useEffect`, event handlers
- This component needs to call server actions and update optimistically

**Interview Tips:**
- Minimize client components to reduce bundle size
- Only add `'use client'` when you need interactivity
- Can nest server components inside client components

---

### 5. **Server Actions**

**What it is:** Functions that run on the server when called from client components. Perfect for mutations (create, update, delete).

**File in this project (`actions/posts.ts`):**
```tsx
'use server';  // ← Marks all functions in file as server actions

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// ✅ Server Action: Can access database, upload files
export async function createPost(prevState: any, formData: any) {
  const title = formData.get('title') as string;
  const image = formData.get('image') as any;
  const content = formData.get('content') as string;

  // Validate on server
  let errors: string[] = [];
  if (!title || title.trim() === '') errors.push('Title is required');
  if (!content || content.trim() === '') errors.push('Content is required');
  if (!image || image.size === 0) errors.push('Image is required');

  if (errors.length > 0) return { errors };

  // Upload image to Cloudinary
  let imageUrl: string = '';
  try {
    imageUrl = await uploadImage(image);
  } catch (error) {
    throw new Error('Image upload failed!');
  }

  // Store in database
  const request = { imageUrl, title, content, userId: 1 };
  await storePost(request);

  // Revalidate cache and redirect
  revalidatePath('/feed');
  redirect('/feed');
}

// ✅ Another Server Action: Update like status
export async function toggleLikePostStatus(postId: number) {
  updatePostLikeStatus(postId, 2);  // Direct DB access
  revalidatePath('/feed');           // Refresh cached page
}
```

**Key Functions:**
- `revalidatePath()` — Clears cached pages so they re-render with fresh data
- `redirect()` — Server-side redirect (happens after action completes)

**How it's called from client (`components/post-form.tsx`):**
```tsx
'use client';
import { useActionState } from 'react';
import { createPost } from '@/actions/posts';

export default function PostForm() {
  // useActionState manages form submission
  const [state, formAction] = useActionState(createPost, {});

  return (
    <form action={formAction}>
      <input type="text" name="title" />
      <input type="file" name="image" />
      <textarea name="content" />
      <button type="submit">Create Post</button>
      {state?.errors && <ul>{state.errors.map(e => <li>{e}</li>)}</ul>}
    </form>
  );
}
```

**Interview Tips:**
- Server actions handle mutations safely (no API routes needed)
- Automatic CSRF protection
- Can use `revalidatePath()` and `redirect()` to manage cache and navigation
- Form can pass `FormData` directly to server action

---

### 6. **Form Submission with `useActionState`**

**What it is:** React hook that manages form submission with server actions, handling loading states and errors.

**Code in this project (`components/post-form.tsx`):**
```tsx
'use client';
import { useActionState } from 'react';

export default function PostForm({ action }) {
  // useActionState(serverAction, initialState)
  const [state, formAction] = useActionState(action, {} as any);

  return (
    <form action={formAction}>
      <input type="text" name="title" />
      <input type="file" name="image" />
      <textarea name="content" />
      <button type="submit">Create Post</button>
      
      {/* Display errors returned from server action */}
      {state?.errors && state.errors.length > 0 && (
        <ul className="form-errors">
          {state.errors.map((error: string) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </form>
  );
}
```

**How it works:**
1. User submits form
2. `formAction` collects FormData and sends to server action
3. Server action validates and returns state
4. Component re-renders with updated state
5. Errors display if validation fails

**Interview Tips:**
- `useActionState` replaces older pattern of manual useState + fetch
- Automatically handles loading state with `useFormStatus`
- Form values clear on successful submission

---

### 7. **Optimistic UI Updates with `useOptimistic`**

**What it is:** React hook that immediately updates UI before server action completes, then reverts if it fails.

**Code in this project (`components/posts.tsx`):**
```tsx
'use client';
import { useOptimistic } from 'react';

export default function Posts({ posts }: { posts: POST[] }) {
  // useOptimistic(serverState, updateFn)
  const [optimisticPosts, updateOptimisticPosts] = useOptimistic(posts, (prevPosts, updatedPostId) => {
    // This function runs IMMEDIATELY when called
    const updatedPostIndex = prevPosts.findIndex(post => post.id === updatedPostId);
    
    if (updatedPostIndex === -1) return prevPosts;
    
    // Create new state with toggled like
    const updatedPost: POST = { ...prevPosts[updatedPostIndex] };
    updatedPost.isLiked = !updatedPost.isLiked;
    updatedPost.likes = updatedPost.likes ?? 0 + (updatedPost.isLiked ? 1 : -1);
    
    const newPosts = [...prevPosts];
    newPosts[updatedPostIndex] = updatedPost;
    return newPosts;
  });

  async function updatePost(postId: number) {
    // 1. Update UI immediately (optimistic)
    updateOptimisticPosts(postId);
    
    // 2. Call server action in background
    await toggleLikePostStatus(postId);
    
    // 3. If server action succeeds, keep optimistic state
    // 4. If it fails, revert to previous state automatically
  }

  return (
    <ul className="posts">
      {optimisticPosts.map((post) => (
        <li key={post.id}>
          {/* Show heart filled immediately on click */}
          <form action={updatePost.bind(null, post.id)}>
            <LikeButton />
          </form>
        </li>
      ))}
    </ul>
  );
}
```

**Flow Diagram:**
```
User clicks ❤️
    ↓
updateOptimisticPosts(postId)  ← UI changes INSTANTLY
    ↓
toggleLikePostStatus(postId)   ← Server action runs in background
    ↓
Server returns success?
    ├─ YES → Keep optimistic state
    └─ NO → Revert to previous state
```

**Interview Tips:**
- Provides instant feedback even on slow networks
- Improves perceived performance dramatically
- Automatically reverts if server action fails
- Perfect for likes, bookmarks, or quick toggles

---

### 8. **Suspense & Streaming**

**What it is:** `Suspense` shows a fallback while data is loading. Works with async server components.

**Code in this project (`app/page.tsx`):**
```tsx
import { Suspense } from 'react';
import Posts from '@/components/posts';
import { getPosts } from '@/lib/posts';

async function LatestPosts() {
  // This async function is awaited inside Suspense
  const latestPosts = await getPosts(2);
  return <Posts posts={latestPosts} />;
}

export default async function Home() {
  return (
    <>
      <h1>Welcome back!</h1>
      <section id="latest-posts">
        {/* Show fallback while LatestPosts data loads */}
        <Suspense fallback={<p>Loading recent posts...</p>}>
          <LatestPosts />
        </Suspense>
      </section>
    </>
  );
}
```

**Also used in routes (`app/feed/loading.tsx`):**
```tsx
// This file is shown while /feed page loads
export default function FeedLoading() {
  return <p>Loading feed data...</p>;
}
```

**Interview Tips:**
- `loading.tsx` automatically wraps route in Suspense
- Shows fallback UI while server component fetches data
- Improves perceived performance (user sees something immediately)
- Can have multiple `Suspense` boundaries for granular loading states

---

### 9. **Error Handling & Error Boundaries**

**What it is:** `error.tsx` catches errors in route segments and shows fallback UI.

**Code in this project (`app/feed/error.tsx`):**
```tsx
'use client';  // ← Error boundaries must be client components

export default function FeedError() {
  return (
    <>
      <h2>An error occurred!</h2>
      <p>Unfortunately, something went wrong. We're working on it!</p>
    </>
  );
}
```

**When it's shown:**
- If `/feed/page.tsx` throws an error
- If any child component in `/feed/` throws

**Interview Tips:**
- Error boundaries are client components even if error occurred in server component
- Can only catch errors during rendering, not during data fetching (use try-catch for that)
- Parent layout stays intact, only error segment shows fallback

---

### 10. **Dynamic Routes (not used, but good to know)**

**Pattern:**
```
app/posts/[id]/page.tsx  → Route: /posts/123, /posts/456
```

**Access params:**
```tsx
export default function PostPage({ params }: { params: { id: string } }) {
  return <h1>Post #{params.id}</h1>;
}
```

---

### 11. **Data Fetching Patterns**

**Pattern 1: In Server Components (Direct DB Access)**
```tsx
// ✅ Recommended for server components
export default async function FeedPage() {
  const posts = await getPosts();  // Direct DB access
  return <Posts posts={posts} />;
}
```

**Pattern 2: With Caching & Revalidation**
```tsx
// In server component or server action
import { revalidatePath, revalidateTag } from 'next/cache';

// Revalidate specific paths
revalidatePath('/feed');        // Clear /feed cache
revalidatePath('/');            // Clear home cache

// Revalidate by tag
revalidateTag('posts');
```

**Code in this project (`actions/posts.ts`):**
```tsx
export async function toggleLikePostStatus(postId: number) {
  updatePostLikeStatus(postId, 2);
  revalidatePath('/feed');  // After mutation, refresh the page
}
```

**Interview Tips:**
- Server components can fetch data directly (no API layer)
- `revalidatePath()` clears cache for specific routes
- Much more efficient than client-side fetching

---

### 12. **Image Optimization**

**What it is:** While not using Next.js `<Image>` component here, the project handles image uploads.

**Code in this project (`lib/cloudinary.ts`):**
```tsx
export async function uploadImage(image: File) {
  // Convert File to base64
  const imageData = await image.arrayBuffer();
  const mime = image.type;
  const base64Data = Buffer.from(imageData).toString('base64');
  const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;
  
  // Upload to Cloudinary
  const result = await cloudinary.uploader.upload(fileUri, {
    folder: 'nextjs-course-mutations',
  });
  
  return result.secure_url;  // Get optimized URL
}
```

**Interview Tips:**
- Next.js `<Image>` component provides automatic optimization
- External storage (Cloudinary) handles delivery and optimization
- Always use CDN for images in production

---

### 13. **TypeScript Integration**

**What it is:** Full TypeScript support for type safety.

**Code in this project (`lib/posts.ts`):**
```tsx
// Define types for better IDE support and safety
export type POST = {
  id?: number | null;
  userId: number | null;
  image?: string;
  imageUrl?: string | null;
  title?: string;
  content?: string | null;
  createdAt?: string;
  userFirstName?: string | null;
  userLastName?: string | null;
  isLiked?: boolean;
  likes?: number;
};

// Use types in functions
export async function getPosts(maxNumber?: number): Promise<POST[]> {
  // Function body...
  return posts;
}
```

**Config in `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "strict": true,           // Enable strict mode
    "noEmit": true,           // Don't emit JS (Next.js handles it)
    "paths": {
      "@/*": ["./*"]          // Path alias @/ → root
    }
  }
}
```

**Interview Tips:**
- Strict TypeScript catches errors at compile time
- Path aliases (`@/`) improve import readability
- Server actions benefit from types (params and return types)

---

### 14. **Environment Variables**

**What it is:** Configuration that changes per environment (dev, staging, production).

**In this project (`.env.local`):**
```
CLOUDINARY_CLOUD_NAME=your_value
CLOUDINARY_API_KEY=your_value
CLOUDINARY_API_SECRET=your_value
```

**Access in code (`lib/cloudinary.ts`):**
```tsx
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error('CLOUDINARY_CLOUD_NAME is not set');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

**Interview Tips:**
- `.env.local` only for development (add to `.gitignore`)
- Use `.env.production` for production variables
- Variables starting with `NEXT_PUBLIC_` are exposed to browser
- API keys should never be `NEXT_PUBLIC_`

---

### 15. **Metadata & SEO**

**What it is:** Next.js handles SEO metadata generation.

**Code in this project (`app/layout.tsx`):**
```tsx
export const metadata = {
  title: 'NextPosts',
  description: 'Browse and share amazing posts.',
};
```

**Generated HTML:**
```html
<head>
  <title>NextPosts</title>
  <meta name="description" content="Browse and share amazing posts." />
</head>
```

**Dynamic metadata in routes:**
```tsx
// For dynamic routes like /posts/[id]
export async function generateMetadata({ params }) {
  const post = await getPost(params.id);
  return {
    title: post.title,
    description: post.content,
  };
}
```

**Interview Tips:**
- Metadata improves SEO and social sharing
- Static metadata in `layout.tsx`, dynamic in page components
- Replaces manual `next/head` approach

---

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

---

## Quick Next.js Concepts Reference

| Concept | File | Purpose | Key Feature |
|---------|------|---------|-------------|
| **App Router** | `app/` | File-based routing | Nested routes via folders |
| **Layout** | `app/layout.tsx` | Shared UI | Persists across navigation |
| **Server Component** | `app/page.tsx` | Data fetching | Direct DB access, smaller bundle |
| **Client Component** | `'use client'` | Interactivity | React hooks, event handlers |
| **Server Action** | `'use server'` | Mutations | Secure, CSRF protected |
| **Suspense** | `<Suspense>` | Loading states | Streaming, progressive loading |
| **Error Boundary** | `error.tsx` | Error handling | Fallback UI on errors |
| **useOptimistic** | Client hook | Optimistic UI | Instant feedback + background sync |
| **useActionState** | Client hook | Form handling | Manage server action state |
| **revalidatePath** | Server action | Cache invalidation | Refresh data after mutation |
| **Metadata** | `export metadata` | SEO | Static/dynamic page titles |

---

## Interview Preparation Checklist

- [ ] Understand App Router vs Pages Router
- [ ] Know when to use Server vs Client components
- [ ] Explain Server Actions and why they're secure
- [ ] Understand `useOptimistic` flow (optimistic → server → confirm/revert)
- [ ] Know `revalidatePath` for cache management
- [ ] Explain Suspense and loading states
- [ ] Understand error boundaries (error.tsx)
- [ ] Be able to explain the complete flow: form submission → server action → DB update → cache revalidation
- [ ] Know TypeScript integration benefits
- [ ] Understand metadata for SEO
- [ ] Know the difference between static and dynamic routes
- [ ] Understand environment variables usage

---

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
