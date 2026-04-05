# Scholr Frontend

## Project Overview
Scholr is an AI-powered scholarship matching platform. It helps students discover scholarships, understand eligibility constraints (like GPA, IELTS, etc.), rank fit, and generate application guidance such as Statement of Purpose (SOP) drafts. 

This repository contains the frontend application, built as a modern web application. It acts as the user-facing surface and operational layer for scholarship decisions, communicating with a backend API (expected at `http://localhost:8000/api/v1` by default).

### Main Technologies
*   **Framework:** Next.js (version 14, using the App Router)
*   **Library:** React 18
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS with a minimal extension layer (currently centered on the default zinc-heavy palette plus the `Inter` font family in `tailwind.config.ts`)
*   **Validation:** Zod

## Building and Running
The project uses standard `npm` scripts as defined in `package.json`.

*   **Development Server:**
    ```bash
    npm run dev
    ```
    Starts the Next.js development server.
*   **Build for Production:**
    ```bash
    npm run build
    ```
*   **Start Production Server:**
    ```bash
    npm start
    ```
*   **Linting:**
    ```bash
    npm run lint
    ```

## Directory Structure
*   `app/`: Contains the Next.js App Router routes and pages (e.g., `/dashboard`, `/scholarships`, `/sign-in`, `/sign-up`, and the landing page `/`).
*   `components/`: Reusable React components (e.g., `site-shell.tsx`, `auth-form.tsx`, `scholarship-card.tsx`).
*   `lib/`: Core utilities and business logic.
    *   `api.ts`: API client functions for communicating with the backend (auth, profiles, matching, SOP generation).
    *   `types.ts`: TypeScript type definitions.
    *   `validation.ts`: Zod schemas for data validation.
*   `providers/`: React context providers, including the auth provider used across app routes.
*   `public/`: Static assets served by Next.js.

## Development Conventions
*   **Routing:** Follows Next.js App Router conventions (`layout.tsx`, `page.tsx`).
*   **Styling:** Utility-first styling with Tailwind CSS. The current UI leans on the neutral zinc palette and does not currently define the broader custom token set referenced in older docs.
*   **State & Data Fetching:** Data fetching relies on the custom API client in `lib/api.ts`, which centralizes `fetch` defaults, JSON parsing, and robust error extraction (including Pydantic field-error mapping and Request ID propagation). Components like `ScholarshipList` and `ProfileForm` include defensive null guards to handle incomplete data safely.
*   **TypeScript:** Strict typing is enforced across components and API responses. Administrative entities (Jobs, Sources) use literal unions for statuses and types to ensure compile-time safety.
*   **Environment:** The frontend expects `NEXT_PUBLIC_API_URL` in `.env.local` (or uses `http://localhost:8000/api/v1` by default).
