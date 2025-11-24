# **Project Context: Next.js Starter Template**

## **1. Project Overview**
This project is a production-ready **Next.js 15.2** starter template designed to accelerate web application development. It comes pre-configured with essential tooling, authentication, database integration, and a robust UI component library.

*   **Name**: `my-nextjs-template`
*   **Framework**: Next.js 15.2 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS + shadcn/ui + Radix UI
*   **Database**: PostgreSQL + Prisma ORM
*   **Authentication**: Better Auth
*   **Testing**: Jest + React Testing Library

## **2. Tech Stack & Dependencies**
*   **Core**: `next`, `react`, `react-dom`
*   **Language**: `typescript`
*   **Styling**: `tailwindcss`, `tailwindcss-animate`, `class-variance-authority`, `clsx`, `tailwind-merge`
*   **UI Components**: `@radix-ui/*`, `lucide-react` (Icons), `recharts` (Charts)
*   **Forms & Validation**: `react-hook-form`, `@hookform/resolvers`, `zod`
*   **Data Fetching**: `@tanstack/react-query`, `axios`
*   **Database**: `@prisma/client`, `prisma`
*   **Authentication**: `better-auth`, `bcryptjs`
*   **File Uploads**: `uploadthing`, `@uploadthing/react`
*   **Email**: `react-email`, `@react-email/components`, `nodemailer`
*   **Utilities**: `date-fns`

## **3. Project Structure**
```
my-nextjs-template/
├── prisma/               # Prisma schema and migrations
├── public/               # Static assets
├── src/
│   ├── app/              # App router pages and API routes
│   │   ├── (pages)/      # Website pages organized by access level
│   │   ├── api/          # API routes (auth, email, etc.)
│   │   └── layout.tsx    # Root layout
│   ├── components/       # React components
│   │   ├── emails/       # Email templates (React Email)
│   │   ├── shared/       # Reusable application components
│   │   └── ui/           # shadcn/ui primitive components
│   ├── config/           # App configuration and constants
│   ├── helpers/          # Helper functions
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Library code (auth, prisma, utils)
│   ├── services/         # Service layer (API clients)
│   ├── styles/           # Global styles
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── .env.example          # Example environment variables
├── next.config.ts        # Next.js configuration
├── package.json          # Project dependencies and scripts
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## **4. Rules & Standards**

### **Code Quality Standards**
*   **Complete Implementations**: When generating code that interacts with database models, always include **ALL** fields from the database schema. Never use comments to indicate omitted fields (like `// other fields`).
*   **No Placeholders**: Never use incomplete code snippets or placeholders - always provide full, executable code implementations.
*   **Strict Optional Chaining**: **ALWAYS** use optional chaining (`?.`) when accessing **ANY** JavaScript object properties to prevent `TypeErrors`.
    *   *Examples*: `user?.name`, `product?.title`, `session?.user?.email`, `arrayItem?.property`, `response?.data?.items`.
    *   *Scope*: Apply this rule consistently with **no exceptions** throughout all code.

### **Responsive Design Requirements**
**MANDATORY FOR ALL PAGES AND COMPONENTS:**
*   **Mobile-First Approach**: Design and develop for mobile devices first, then enhance for larger screens.
*   **Breakpoint Coverage**: Every component must work seamlessly across all Tailwind breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`).
*   **Touch-Friendly Interfaces**: All interactive elements must be touch-optimized (minimum 44px touch targets).
*   **Responsive Typography**: Use responsive text sizing with Tailwind utilities.
*   **Flexible Layouts**: Use CSS Grid and Flexbox with responsive utilities.
*   **Responsive Images**: Always use Next.js `Image` component with responsive sizing and proper `sizes` attribute.
*   **Navigation Adaptation**: Mobile navigation should use `Sheet` components; desktop should use standard dropdowns.
*   **Form Optimization**: Forms must be optimized for mobile input with proper keyboard types and validation.
*   **Performance**: Ensure fast loading on mobile networks with optimized assets and lazy loading.

### **Next.js 15.2.3 Specific Requirements**
*   **Async Request APIs**: APIs that rely on request-specific data are now asynchronous (e.g., `cookies()`, `headers()`).
*   **Dynamic Route Segments**: Route Handler `params` are now **Promises** that must be awaited.
    ```typescript
    export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
      const { slug } = await params; // Must use await
    }
    ```
*   **Page Components**: **Never** convert a Next.js page (`src/app/**/page.tsx`) into a client component (`"use client"`). Always create a new child component in a `_components/` directory and mark that child with `"use client"`.

### **URL Structure and Routing**
*   **Public Content**: Use SEO-friendly slug-based URLs.
    *   Product Pages: `/product/[slug]` (e.g., `/product/elegant-evening-dress`)
    *   Collection Pages: `/collections/[slug]`
*   **Internal/Admin**: Use ID-based parameters.
    *   Category Filtering: `/products?category=[id]`
    *   Admin Routes: `/admin/products/[id]`
*   **API Endpoints**:
    *   Public: `/api/product/[slug]`
    *   Admin: `/api/admin/products/[id]`
*   **Important Rules**:
    *   **Never** use ID-based URLs for public product pages.
    *   **Always** use `product?.slug` when linking to products.

### **Data Fetching and State Management**
*   **Library**: TanStack Query (React Query).
*   **Configuration**: `src/lib/query-client.ts`.
*   **Usage**: Use `useQuery` and `useMutation` hooks.
*   **Keys**: Always define query keys as constants (e.g., `src/lib/query-keys.ts`).
    *   Product Queries: `[queryKeys.products, slug]`
*   **Structure**: Define query functions in separate files (e.g., `src/lib/queries/`).
*   **Features**: Implement proper error handling, loading states, and optimistic updates.

### **Caching and Revalidation Rules**
*   **No Time-Based Revalidation**: **Never** use `revalidate: 3600` in `unstable_cache`.
*   **Tag-Based Invalidation**: Always rely on cache tags for explicit invalidation.
*   **Strategy**: Invalidate tags in API routes that modify data.
*   **Hero Items**: Use `SSGCacheKeys.heroItems`.

### **Form and Modal Best Practices**
*   **Responsive Forms**: Use `w-full max-w-full` to prevent overflow.
*   **Loading States**: Always implement loading indicators.
*   **Duplicate Prevention**: Implement client-side validation.
*   **Dialog Accessibility**: Always include `DialogDescription`.
*   **Mobile Optimization**: Use responsive spacing (e.g., `space-y-8 sm:space-y-12`).

### **Authentication Integration**
*   **Library**: Better Auth.
*   **Client-Side**: Use `authClient.useSession()` hook.
    ```typescript
    const { data: session, isPending, error } = authClient.useSession()
    ```
*   **Server-Side**: Use `auth.api.getSession`.
    ```typescript
    const session = await auth.api.getSession({ headers: await headers() })
    ```
*   **State**: Avoid manually managing session state with `useState`/`useEffect`.

### **File Upload Implementation**
*   **Library**: UploadThing v7.
*   **Router**: `src/app/api/uploadthing/core.ts`.
*   **Client Components**: Import from `@/utils/uploadthing` or use `CustomUploadButton`.
*   **Server Operations**: Use `utapi` from `@/utils/utapi`.
*   **Callbacks**: Always implement `onClientUploadComplete` and `onUploadError`.
*   **Deletion**: DELETE endpoint at `/api/admin/uploadthing/[id]`.

### **UI and Navigation Best Practices**
*   **Link Components**: Always use `next/link`.
    ```tsx
    <Link href={`/product/${product?.slug}`}>{product?.name}</Link>
    ```
*   **Toast Notifications**: Always use **shadcn/ui**'s toast system (`useToast`). **Do not** use external libraries like `sonner`.
    ```tsx
    const { toast } = useToast();
    toast({ title: "Success", description: "Action completed" });
    ```
*   **Toaster**: Ensure `<Toaster />` is in the root layout.

## **5. Key Features**

### **Authentication (`src/lib/auth.ts`)**
*   **Powered by**: Better Auth.
*   **Features**: Email/Password, Email Verification, Password Reset, RBAC.
*   **Documentation**: See [Authentication Features](features/authentication.md) for full details.

### **Database (`prisma/schema.prisma`)**
*   **ORM**: Prisma.
*   **Provider**: PostgreSQL.
*   **Documentation**: See [Database Features](features/database.md) for full details.

### **UI & Design System**
*   **Component Library**: **shadcn/ui** (located in `src/components/ui`).
    *   *Philosophy*: NOT a dependency library. Components are copied directly into the project, giving full control over the code.
    *   *Installed Components*: Accordion, Alert, Button, Card, Dialog, Form, Input, Sheet, Sidebar, Table, Toast, and more.
    *   *Styling*: Built on **Tailwind CSS** and **Radix UI** primitives.
*   **Global Styles**: `src/app/globals.css` defines CSS variables for theming (colors, radius).
*   **Primary Color**: Deep Red/Burgundy (HSL 352 50% 29%).
*   **Radius**: `1rem` (Rounded corners).

### **Email System (`src/components/emails/`)**
*   **Templates**: Built with `react-email`.
*   **Example**: `EmailConfirmationTemplate.tsx` - Responsive email template for verifying user accounts.

## **6. Development Guidelines**

### **Scripts**
*   `npm run dev`: Start development server (Port 3000).
*   `npm run build`: Generate Prisma client and build for production.
*   `npm run lint`: Run ESLint.
*   `npm run test`: Run Jest tests.
*   `npm run typecheck`: Run TypeScript compiler check.

### **Adding New Features**
1.  **Database**: Update `prisma/schema.prisma` and run `npx prisma migrate dev`.
2.  **API**: Create new routes in `src/app/api/`.
3.  **UI**: Use components from `src/components/ui/` or generate new ones.
4.  **Forms**: Use `react-hook-form` with `zod` schemas.

## **7. Configuration**
*   **Environment Variables**: Managed in `.env` (see `.env.example`).
    *   `DATABASE_URL`: PostgreSQL connection string.
    *   `NEXT_PUBLIC_APP_URL`: Base URL of the application.
    *   `BETTER_AUTH_SECRET`: Secret for authentication.
    *   `SMTP_*`: Email server configuration.