# Scholr Frontend

## Project Overview
Scholr is an AI-powered scholarship matching platform. It helps students discover scholarships, understand eligibility constraints (like GPA, IELTS, etc.), rank fit, and generate application guidance such as Statement of Purpose (SOP) drafts. 

This repository contains the frontend application, built as a modern web application. It acts as the user-facing surface and operational layer for scholarship decisions, communicating with a backend API (expected at `http://localhost:8000/api/v1` by default).

### Main Technologies
*   **Framework:** Next.js (version 14, using the App Router)
*   **Library:** React 18
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (with custom design tokens like `bark`, `bronze`, `custard`)
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

## Development Conventions
*   **Routing:** Follows Next.js App Router conventions (`layout.tsx`, `page.tsx`).
*   **Styling:** Utility-first styling with Tailwind CSS. Custom colors and design tokens are extensively used.
*   **State & Data Fetching:** Data fetching relies on the custom API client in `lib/api.ts` which uses the native `fetch` API. It includes credential inclusion for authenticated requests.
*   **TypeScript:** Strict typing is enforced across components and API responses.
