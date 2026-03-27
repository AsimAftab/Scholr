# Scholr Roadmap

This file tracks the recommended production roadmap for Scholr.

It is intentionally practical and grouped by delivery area.

## Phase 1: Production Foundation

Status:

- mostly started
- partially complete

Goals:

- stable runtime and migration flow
- consistent environment management
- baseline auth and request logging
- stronger product shell and route structure

Completed or partially completed:

- cookie-based auth
- request logging and request IDs
- normalized API errors
- Alembic migration scaffold
- Docker-based stack startup
- public/auth/app route split on frontend
- authenticated sidebar shell

Still needed:

- automated backend tests
- frontend integration tests
- stricter auth/session hardening
- observability hooks

## Phase 2: Scholarship Data Platform

Goals:

- move beyond seed data
- create actual ingestion and persistence workflows

Work items:

1. Add admin or operator ingestion endpoints.
2. Store crawler results in the database instead of printing only.
3. Add source tracking and ingestion metadata.
4. Add scholarship status fields such as `draft`, `published`, `archived`.
5. Add deduplication logic beyond `source_url`.
6. Add retry/error tracking for crawling runs.

## Phase 3: Matching and User Workflow

Goals:

- make the product useful beyond profile save + match

Work items:

1. Add scholarship detail pages.
2. Add saved scholarships.
3. Add applied / in-progress / submitted states.
4. Add missing requirement drilldown and reasoning UI.
5. Add profile completeness scoring.
6. Add scholarship filtering and search.

## Phase 4: AI Productization

Goals:

- move AI from helper output to reliable workflow component

Work items:

1. Add prompt versioning.
2. Add AI output persistence.
3. Add document generation history per user.
4. Add structured scholarship summary generation on ingestion.
5. Add moderation / safety checks around generated outputs.
6. Add async jobs for slow generation tasks.

## Phase 5: Security and Compliance

Goals:

- harden the app for real user traffic

Work items:

1. Add CSRF protection for session-authenticated writes.
2. Add session rotation and invalidation strategy.
3. Add password reset flow.
4. Add email verification.
5. Add audit logging.
6. Add role-based permissions.
7. Add rate limiting.
8. Add secrets handling and deployment hardening.

## Phase 6: Platform and Operations

Goals:

- support real deployment and operations

Work items:

1. Add CI checks for lint, build, backend validation, and migrations.
2. Add test automation.
3. Add centralized logging/observability integration.
4. Add staging and production deployment configs.
5. Add DB backup and restore guidance.
6. Add environment promotion strategy.

## Design Roadmap

Goals:

- push the interface from “working app” to “serious SaaS product”

Work items:

1. Build a formal design system token layer.
2. Add reusable data table, badge, stats, and empty-state components.
3. Add scholarship detail and application pipeline views.
4. Add mobile sidebar patterns.
5. Add richer dashboards with meaningful charts or status modules.

## Suggested Priority Order

If continuing immediately, the next implementation order should be:

1. tests
2. scholarship persistence and ingestion
3. scholarship details + saved/applied states
4. auth hardening
5. background job system
6. admin/operator tooling

