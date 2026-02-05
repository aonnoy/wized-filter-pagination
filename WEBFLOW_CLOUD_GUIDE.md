# Webflow Cloud + Next.js Development Guide

This guide provides a comprehensive overview of building Next.js applications with Webflow Cloud and DevLink for LLM-assisted development.

## Table of Contents

1. [Overview](#overview)
2. [How Webflow Cloud Works](#how-webflow-cloud-works)
3. [DevLink: The Component Bridge](#devlink-the-component-bridge)
4. [CLI Commands Reference](#cli-commands-reference)
5. [Development Workflow](#development-workflow)
6. [Project Structure](#project-structure)
7. [LLM Developer Instructions](#llm-developer-instructions)
8. [Best Practices](#best-practices)
9. [Working with Xano Backend](#working-with-xano-backend)

---

## Overview

Webflow Cloud allows you to deploy full-stack web applications (Next.js or Astro) alongside your Webflow site on the same domain. The key integration is **DevLink**, which exports your Webflow components as React components that can be imported directly into your Next.js app.

### Key Benefits:
- Design UI visually in Webflow Designer
- Get React components automatically via CLI
- Same domain deployment (e.g., `mysite.com` for Webflow, `mysite.com/app` for Next.js)
- Seamless design-to-code workflow

---

## How Webflow Cloud Works

### Architecture
```
┌─────────────────────────────────────────────────┐
│                  Your Domain                     │
├─────────────────────────────────────────────────┤
│   /              │   /app (mount path)           │
│   Webflow Site   │   Next.js App                 │
│   (Marketing,    │   (Customer Portal,           │
│    Landing)      │    Dashboard, etc.)           │
├─────────────────────────────────────────────────┤
│   Hosted by      │   Hosted by Webflow Cloud     │
│   Webflow        │   (Edge Runtime)              │
└─────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────┐
│   External Backend (e.g., Xano)                  │
│   - APIs                                         │
│   - Database                                     │
│   - Authentication                               │
└─────────────────────────────────────────────────┘
```

### Supported Frameworks
- **Next.js** (App Router recommended)
- **Astro**

### Storage Options (Built-in)
- SQLite (persistent database)
- Key-Value Store
- Object Storage

---

## DevLink: The Component Bridge

DevLink is the system that converts your Webflow components into React components.

### What Gets Exported

When you run the CLI, DevLink syncs:
- **Components** - Your custom Webflow components become React components
- **Styles** - CSS variables, global styles
- **Variables** - Design tokens (colors, spacing, typography)
- **Built-in Elements** - Basic components like Section, Block, Link

### Folder Structure After Sync

```
/devlink
├── _Builtin.tsx          # Basic Webflow elements
├── Navbar.tsx            # Your custom Navbar component
├── Footer.tsx            # Your custom Footer component
├── HeroSection.tsx       # Your custom Hero component
├── Card.tsx              # Your custom Card component
├── DevLinkProvider.tsx   # Provider for Webflow interactions
└── index.ts              # Exports all components
```

### Importing Components

```typescript
// Import custom components
import { Navbar } from "@/devlink/Navbar";
import { Footer } from "@/devlink/Footer";
import { Card } from "@/devlink/Card";

// Import built-in elements
import { Section, Block, Link, Image } from "@/devlink/_Builtin";
```

### Component Props

DevLink components can receive props for dynamic content:

```typescript
<Navbar
  navbarLinkFeatures="Features"
  navbarLinkProducts="Products"
  navbarLinkResources="Resources"
  navbarLinkContact="Contact"
/>

<Card
  cardTitle={project.name}
  cardDescription={project.description}
  cardImage={project.imageUrl}
/>
```

---

## CLI Commands Reference

### Installation

```bash
npm install -g @webflow/webflow-cli
```

### Core Commands

| Command | Description |
|---------|-------------|
| `webflow cloud init` | Create a new project scaffold synced with Webflow |
| `webflow auth login` | Authenticate with your Webflow account |
| `webflow devlink sync` | Sync/update components from Webflow |
| `webflow cloud deploy` | Deploy to Webflow Cloud |
| `npm run preview` | Local preview mimicking Webflow Cloud environment |

### Initialize a New Project

```bash
webflow cloud init
```

This command will:
1. Ask you to select a framework (Next.js or Astro)
2. Ask for a mount path (e.g., `/app`)
3. Authenticate you with Webflow
4. Sync your design system via DevLink

### Sync Components

After making changes to components in Webflow Designer:

```bash
webflow devlink sync
```

### Configuration File

Create `.webflowrc.json` in your project root:

```json
{
  "host": "https://api.webflow.com",
  "rootDir": "./devlink",
  "siteId": "[YOUR_SITE_ID]",
  "authToken": "[API_TOKEN]"
}
```

Or use JavaScript (`.webflowrc.js`) for environment variables:

```javascript
module.exports = {
  host: "https://api.webflow.com",
  rootDir: "./devlink",
  siteId: process.env.WEBFLOW_SITE_ID,
  authToken: process.env.WEBFLOW_AUTH_TOKEN,
};
```

---

## Development Workflow

### Step-by-Step Process

1. **Design in Webflow**
   - Create your UI components in Webflow Designer
   - Use semantic naming for components (e.g., `ProjectCard`, `DashboardNav`)
   - Define component props for dynamic content

2. **Initialize Project**
   ```bash
   webflow cloud init
   npm install
   ```

3. **Develop Locally**
   ```bash
   npm run dev
   ```

4. **Import & Use Components**
   ```typescript
   // src/app/dashboard/page.tsx
   import { DashboardNav } from "@/devlink/DashboardNav";
   import { ProjectCard } from "@/devlink/ProjectCard";
   
   export default async function Dashboard() {
     const projects = await fetchProjects();
     
     return (
       <>
         <DashboardNav userName={user.name} />
         <div className="project-grid">
           {projects.map((project) => (
             <ProjectCard
               key={project.id}
               projectTitle={project.name}
               projectStatus={project.status}
             />
           ))}
         </div>
       </>
     );
   }
   ```

5. **Re-sync on Design Changes**
   ```bash
   webflow devlink sync
   ```

6. **Deploy**
   ```bash
   webflow cloud deploy
   ```
   Or push to GitHub for auto-deployment.

---

## Project Structure

### Recommended Next.js Structure

```
/project-root
├── /devlink                    # Auto-generated by DevLink
│   ├── _Builtin.tsx
│   ├── Navbar.tsx
│   └── ...
├── /src
│   ├── /app
│   │   ├── layout.tsx          # Root layout with DevLinkProvider
│   │   ├── page.tsx            # Landing page
│   │   └── /(portal)           # Route group for authenticated pages
│   │       ├── layout.tsx      # Portal layout (shared nav, auth check)
│   │       ├── dashboard/
│   │       │   └── page.tsx
│   │       ├── projects/
│   │       │   ├── page.tsx
│   │       │   └── [id]/
│   │       │       └── page.tsx
│   │       └── settings/
│   │           └── page.tsx
│   ├── /components             # Custom React components (non-Webflow)
│   │   ├── forms/
│   │   ├── modals/
│   │   └── data-display/
│   ├── /lib
│   │   ├── auth.ts             # Authentication config
│   │   ├── xano.ts             # Xano API client
│   │   └── utils.ts            # Utility functions
│   └── /types
│       └── index.ts            # TypeScript type definitions
├── .webflowrc.json             # Webflow CLI configuration
├── .env.local                  # Environment variables
├── next.config.js
├── package.json
└── tsconfig.json
```

### Root Layout with DevLinkProvider

```typescript
// src/app/layout.tsx
import { DevLinkProvider } from "@/devlink/DevLinkProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <DevLinkProvider>
          {children}
        </DevLinkProvider>
      </body>
    </html>
  );
}
```

---

## LLM Developer Instructions

When working with an LLM as your developer, provide these instructions:

### Context to Always Include

```markdown
## Project Context

This is a Next.js 15 app deployed on Webflow Cloud.

### Tech Stack
- Framework: Next.js 15 (App Router)
- Language: TypeScript (strict mode)
- UI Components: Webflow DevLink (imported from @/devlink)
- Backend: Xano (APIs and database)
- Auth: NextAuth.js with Xano provider

### DevLink Components Available
Components are imported from @/devlink. Do NOT create new UI components 
unless explicitly requested - use the Webflow components instead.

Available components:
- Navbar, Footer, Sidebar
- ProjectCard, UserCard
- Button, Input, Form elements
- Section, Container, Block (built-ins)

### API Integration
All Xano API calls go through /api routes (server-side only).
Never expose XANO_API_KEY to the client.
```

### Rules for the LLM

```markdown
## Rules

1. **Use DevLink components** - Import UI from @/devlink, don't create new styled components
2. **TypeScript always** - All code must be TypeScript with proper types
3. **Server Components first** - Use Server Components by default, Client Components only when needed
4. **API routes for backend** - All Xano calls through Next.js API routes
5. **Error handling** - Always include try/catch and user-friendly error states
6. **Loading states** - Use React Suspense and loading.tsx files
7. **Re-sync reminder** - If UI changes are needed, remind me to update in Webflow and run `webflow devlink sync`
```

### Example PRD for LLM

```markdown
# Feature: Project Dashboard

## Overview
Display a list of user's projects with search and filter capabilities.

## Components to Use (from DevLink)
- DashboardNav (navigation)
- ProjectCard (individual project display)
- SearchInput (search bar)
- FilterDropdown (status filter)
- EmptyState (when no projects)

## Data Requirements
- GET /projects - List all projects for authenticated user
- Query params: search, status, page

## Acceptance Criteria
- [ ] Show loading skeleton while fetching
- [ ] Display projects in responsive grid
- [ ] Search by project name
- [ ] Filter by status (active, completed, archived)
- [ ] Show empty state when no results
- [ ] Error state if API fails
```

---

## Best Practices

### 1. Component Naming in Webflow
- Use PascalCase: `ProjectCard`, `DashboardNav`
- Be descriptive: `UserSettingsForm` not just `Form`
- Group by feature: `Dashboard_StatsCard`, `Dashboard_Nav`

### 2. Props Design in Webflow
- Define text props for dynamic content
- Define image props for dynamic images
- Define boolean props for conditional rendering (show/hide sections)

### 3. State Management
- Server state: Use React Server Components + fetch
- Client state: Use React Context or Zustand
- Form state: Use React Hook Form

### 4. Error Handling

```typescript
// src/app/dashboard/page.tsx
import { Suspense } from "react";
import { DashboardSkeleton } from "@/devlink/DashboardSkeleton";
import { ErrorState } from "@/devlink/ErrorState";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  try {
    const data = await fetchDashboardData();
    return <DashboardContent data={data} />;
  } catch (error) {
    return <ErrorState message="Failed to load dashboard" />;
  }
}
```

### 5. Authentication Pattern

```typescript
// src/app/(portal)/layout.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { PortalNav } from "@/devlink/PortalNav";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <PortalNav userName={session.user?.name} />
      <main>{children}</main>
    </>
  );
}
```

---

## Working with Xano Backend

### API Client Setup

```typescript
// src/lib/xano.ts
const XANO_API_URL = process.env.XANO_API_URL!;

interface XanoConfig {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  token?: string;
}

export async function xanoRequest<T>({
  endpoint,
  method = "GET",
  body,
  token,
}: XanoConfig): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${XANO_API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "API request failed");
  }

  return res.json();
}
```

### Protected API Route Example

```typescript
// src/app/api/projects/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { xanoRequest } from "@/lib/xano";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const projects = await xanoRequest({
      endpoint: "/projects",
      token: session.accessToken as string,
    });

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
```

### NextAuth.js Configuration with Xano

```typescript
// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { xanoRequest } from "./xano";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await xanoRequest<{
            authToken: string;
            user: { id: number; email: string; name: string };
          }>({
            endpoint: "/auth/login",
            method: "POST",
            body: {
              email: credentials.email,
              password: credentials.password,
            },
          });

          return {
            id: String(response.user.id),
            email: response.user.email,
            name: response.user.name,
            accessToken: response.authToken,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
```

---

## Environment Variables

```bash
# .env.local

# Xano
XANO_API_URL=https://x123-456.xano.io/api:main
XANO_API_KEY=your_api_key_here

# NextAuth
NEXTAUTH_SECRET=generate-a-secure-secret
NEXTAUTH_URL=http://localhost:3000

# Webflow (if needed for CLI)
WEBFLOW_SITE_ID=your_site_id
WEBFLOW_AUTH_TOKEN=your_auth_token
```

---

## Quick Reference

### Daily Development Commands

```bash
# Start development server
npm run dev

# Sync Webflow components after design changes
webflow devlink sync

# Preview with Webflow Cloud environment
npm run preview

# Deploy to Webflow Cloud
webflow cloud deploy
```

### Checklist Before Deployment

- [ ] All DevLink components are up to date (`webflow devlink sync`)
- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] API routes handle errors gracefully
- [ ] Environment variables are set in Webflow Cloud dashboard
- [ ] Authentication flows are tested
- [ ] Mobile responsiveness verified (inherited from Webflow)

---

## Resources

- [Webflow Cloud Documentation](https://developers.webflow.com/webflow-cloud/getting-started)
- [DevLink Reference](https://developers.webflow.com/devlink/reference/overview)
- [Webflow CLI Reference](https://developers.webflow.com/webflow-cloud/cli-reference)
- [Next.js Documentation](https://nextjs.org/docs)
- [Xano Documentation](https://docs.xano.com/)
