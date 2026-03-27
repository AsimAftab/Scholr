# Frontend Guide

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Zod for client-side validation

Root:

- `frontend/`

## Route Structure

Public routes:

- `/`
- `/sign-in`
- `/sign-up`

Authenticated routes:

- `/dashboard`
- `/scholarships`

## Important Files

- [layout.tsx](C:\Users\asima\Desktop\Projects\Scholr\frontend\app\layout.tsx)
- [globals.css](C:\Users\asima\Desktop\Projects\Scholr\frontend\app\globals.css)
- [page.tsx](C:\Users\asima\Desktop\Projects\Scholr\frontend\app\page.tsx)
- [sign-in/page.tsx](C:\Users\asima\Desktop\Projects\Scholr\frontend\app\sign-in\page.tsx)
- [sign-up/page.tsx](C:\Users\asima\Desktop\Projects\Scholr\frontend\app\sign-up\page.tsx)
- [dashboard/page.tsx](C:\Users\asima\Desktop\Projects\Scholr\frontend\app\dashboard\page.tsx)
- [scholarships/page.tsx](C:\Users\asima\Desktop\Projects\Scholr\frontend\app\scholarships\page.tsx)

Shared components:

- [app-shell.tsx](C:\Users\asima\Desktop\Projects\Scholr\frontend\components\app-shell.tsx)
- [site-shell.tsx](C:\Users\asima\Desktop\Projects\Scholr\frontend\components\site-shell.tsx)
- [auth-form.tsx](C:\Users\asima\Desktop\Projects\Scholr\frontend\components\auth-form.tsx)
- [dashboard-overview.tsx](C:\Users\asima\Desktop\Projects\Scholr\frontend\components\dashboard-overview.tsx)
- [profile-form.tsx](C:\Users\asima\Desktop\Projects\Scholr\frontend\components\profile-form.tsx)
- [scholarship-card.tsx](C:\Users\asima\Desktop\Projects\Scholr\frontend\components\scholarship-card.tsx)
- [scholarship-list.tsx](C:\Users\asima\Desktop\Projects\Scholr\frontend\components\scholarship-list.tsx)

Providers:

- [app-provider.tsx](C:\Users\asima\Desktop\Projects\Scholr\frontend\providers\app-provider.tsx) - Root provider wrapper
- [auth-provider.tsx](C:\Users\asima\Desktop\Projects\Scholr\frontend\providers\auth-provider.tsx) - Authentication context provider

Libraries:

- [api.ts](C:\Users\asima\Desktop\Projects\Scholr\frontend\lib\api.ts)
- [auth-context.ts](C:\Users\asima\Desktop\Projects\Scholr\frontend\lib\auth-context.ts) - Custom hook for auth context
- [types.ts](C:\Users\asima\Desktop\Projects\Scholr\frontend\lib\types.ts)
- [validation.ts](C:\Users\asima\Desktop\Projects\Scholr\frontend\lib\validation.ts)

## Auth Flow

- Frontend uses cookie-based auth with global state management via React Context.
- Auth state is persisted across route changes through `AuthProvider` in `providers/`.
- Requests are sent with `credentials: "include"`.
- Session resolution happens through `GET /api/v1/auth/me` on app load.
- Protected pages use the `useAuthContext()` hook and redirect unauthenticated users to `/sign-in`.
- Auth state persists during navigation without page refreshes or re-fetching.

## Theme System

Theme tokens live in:

- [tailwind.config.ts](C:\Users\asima\Desktop\Projects\Scholr\frontend\tailwind.config.ts)
- [globals.css](C:\Users\asima\Desktop\Projects\Scholr\frontend\app\globals.css)

Primary color families:

- `bronze`
- `bark`
- `custard`
- `chocolate`
- `paprika`

Design guidance:

- keep the UI in a serious SaaS direction
- avoid reverting to toy-like cards and generic startup gradients
- preserve the sidebar shell for authenticated areas
- preserve the stronger landing page section structure

## Validation

Client-side validation uses Zod in:

- [validation.ts](C:\Users\asima\Desktop\Projects\Scholr\frontend\lib\validation.ts)

Current forms validated:

- sign-up
- sign-in
- profile form

## Frontend Env Files

- [frontend/.env.example](C:\Users\asima\Desktop\Projects\Scholr\frontend\.env.example)
- [frontend/.env.development.example](C:\Users\asima\Desktop\Projects\Scholr\frontend\.env.development.example)
- [frontend/.env.production.example](C:\Users\asima\Desktop\Projects\Scholr\frontend\.env.production.example)

Primary variable:

- `NEXT_PUBLIC_API_URL`

## Safe Editing Guidance

- keep API access centralized in `lib/api.ts`
- keep auth/session concerns in `providers/auth-provider.tsx` and consumed via `lib/auth-context.ts`
- add new providers to the `providers/` directory for app-wide state management
- do not add one-off fetch logic into random components
- do not collapse the route-based structure back into a single page
- prefer reusable layout and data display components over page-local duplication

## Highest-Value Next Frontend Work

1. scholarship detail pages
2. saved/applied/submitted application states
3. mobile sidebar behavior
4. richer dashboard modules
5. component library formalization

