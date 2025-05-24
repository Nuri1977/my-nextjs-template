# Repository Custom Instructions for GitHub Copilot

- As a programming agent, I assist with code editing, generation, and problem-solving in this project. I provide complete code implementation rather than partial snippets.
- This project is a web application built using Next.js and TypeScript.
- The project uses Tailwind CSS for styling, with custom configurations defined in `tailwind.config.ts`.
- PostgreSQL is the database, hosted on Neon.tech, and connects via SSL. The connection string is stored in the `DATABASE_URL` environment variable.
- Prisma is used as the ORM, with the schema defined in `prisma/schema.prisma`.
- The project uses shadcn/ui (also known as "chadcn") component library:
  - The `src/components/ui/` directory contains reusable UI components built with shadcn/ui
  - All UI components are built following the shadcn/ui component patterns using Radix UI primitives
  - New components should be added using the shadcn/ui CLI with `npx shadcn-ui add [component-name]`
  - Follow shadcn/ui conventions for component composition and styling
  - Use the cn() utility from `@/lib/utils.ts` for conditional class merging
  - Prefer using shadcn/ui components over creating custom ones when possible
  - Refer to the existing components for styling and implementation patterns
- The project uses Radix UI components extensively for building accessible UI elements.
- When generating code that interacts with database models, always include ALL fields from the database schema. Never use comments to indicate omitted fields (like `// other fields`). For example, when creating a new Program, include all fields defined in the Prisma schema.
- Never use incomplete code snippets or placeholders - always provide full, executable code implementations.
- The project uses UploadThing v7 for file uploads and management:
  - File router is defined in `src/app/api/uploadthing/core.ts` with route-specific configurations
  - Client-side components are imported from `@/utils/uploadthing` which provides the typed `UploadButton` and `UploadDropzone` components
  - There's a custom `CustomUploadButton` component in `src/components/shared/CustomUploadButton.tsx` that wraps the UploadThing component with project-specific styling and toast notifications
  - For server-side operations (like deleting files), use the `utapi` instance from `@/utils/utapi`
  - When handling uploads, always implement both `onClientUploadComplete` and `onUploadError` callbacks
  - File deletion is handled through a DELETE endpoint at `/api/admin/uploadthing/[id]` via the `deleteImage` function in the client-side image service
  - Use proper typing with the `OurFileRouter` type from the core router configuration
- The project uses Next.js 15.2.3 with React 18.3.1, which includes several important features and breaking changes:
  - Async Request APIs: APIs that rely on request-specific data are now asynchronous (e.g., `cookies()`, `headers()`)
  - Client Router Cache: Page components' data is always fetched fresh during navigation
  - React 19 support (though this project still uses React 18)
  - Turbopack is stable for development
  - TypeScript support for `next.config.ts`
  - Enhanced Forms with `next/form`
  - Dynamic Route Segments in Route Handlers now provide params as a Promise that must be awaited:
    ```tsx
    // Next.js 15 Route Handler with Dynamic Segments
    export async function GET(
      request: Request,
      { params }: { params: Promise<{ slug: string }> }
    ) {
      const { slug } = await params; // Must use await with params
      // Use slug value here
    }
    ```
  - Breaking changes include:
    - Node.js minimum version is 18.18.0
    - Changes to `next/dynamic` API
    - Middleware applies `react-server` condition
    - Removed support for external `@next/font` package
    - `force-dynamic` now sets a `no-store` default to the fetch cache
    - Request-specific APIs like `cookies()` and `headers()` are now async
    - Route Handler's params object is now a Promise that must be awaited
- Authentication is handled using the Better Auth library:
  - Server-side auth is configured in `src/lib/auth.ts` using `betterAuth()` with the Prisma adapter
  - Client-side auth functionality is available through `authClient` from `src/lib/auth-client.ts`
  - Login and registration forms are in the `_components` directories under their respective page routes
  - The auth system supports email/password authentication with plans to add social logins in the future
  - For accessing user session data:
    - In client components: Always use the `useSession` hook: `const { data: session, isPending, error } = authClient.useSession()`
    - On the server: Use `const session = await auth.api.getSession({ headers: await headers() })`
    - Avoid manually managing session state with useState/useEffect
- The development server runs on port 3000 by default.
- When generating code or responses, follow the conventions defined in the Tailwind CSS configuration and use TypeScript syntax.
- Never convert a Next.js page (e.g. files in `src/app/**/page.tsx`) into a client component by adding the `"use client"` directive. Instead, always create a new child component (e.g. in a `_components/` directory) and mark that child with `"use client"` if you need client-side features like React hooks.
- ALWAYS use optional chaining (`?.`) when accessing ANY JavaScript object properties to prevent TypeErrors, even if you believe the property cannot be undefined or null. This is a strict requirement for ALL object property access in this codebase. Examples:
  - Use `user?.name` never `user.name`
  - Use `program?.title` never `program.title`
  - Use `session?.user?.email` never `session.user.email`
  - Use `arrayItem?.property` never `arrayItem.property` when iterating through arrays
  - Use `response?.data?.items` never `response.data.items`
  - Apply this rule consistently with no exceptions throughout all code
- Always use Next.js `Link` component from "next/link" instead of HTML `<a>` tags for internal navigation and external links. This improves performance through prefetching and client-side navigation. For example:

  ```tsx
  // Correct usage:
  import Link from "next/link";

  // For internal links
  <Link href="/about">About</Link>

  // For external links
  <Link href="https://example.com" target="_blank" rel="noopener noreferrer">
    External Link
  </Link>

  // With Button components that need Link functionality
  <Button asChild>
    <Link href="/contact">Contact Us</Link>
  </Button>
  ```

- For toast notifications, always use shadcn/ui's toast system. Don't use external toast libraries like sonner, react-hot-toast, etc. The correct imports are:

  ```tsx
  // Import the hook
  import { useToast } from "@/hooks/use-toast";

  // Using the toast
  const { toast } = useToast();

  // Showing a toast
  toast({
    title: "Success",
    description: "Action completed successfully",
  });

  // Showing a destructive toast
  toast({
    title: "Error",
    description: "Something went wrong",
    variant: "destructive",
  });
  ```

- Make sure the Toaster component is added to your layout:

  ```tsx
  import { Toaster } from "@/components/ui/toaster";

  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>
          {children}
          <Toaster />
        </body>
      </html>
    );
  }
  ```
