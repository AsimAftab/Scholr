# Admin Ingestion And Matching Plan

## Goal

Build a production-grade admin portal and backend control plane for:

- triggering global scholarship ingestion jobs
- managing official source coverage by country and region
- refreshing match results for one user or all users
- keeping the global scholarship table canonical
- keeping user-facing ranking results profile-aware and fast

## Production Principles

- crawl once globally, never per user
- treat `scholarships` as the canonical global dataset
- treat user match results as derived state from the global dataset plus user profile
- make all heavy work job-driven and auditable
- separate source registry, crawl execution, ingestion, and personalization

## System Components

### 1. Admin Portal

Responsibilities:

- trigger full ingestion runs
- trigger ingestion by country, region, or source
- enable or disable sources
- inspect job history, failures, and freshness
- trigger rematch runs for one user or all users
- monitor counts of inserted, updated, skipped, and failed records

### 2. Source Registry

Store source metadata in a global table:

- source key
- source name
- base URL
- country
- region
- fetcher kind
- official flag
- enabled flag
- last crawl time

This should mirror crawler manifests, but production ownership should live in the database so admin actions can change runtime behavior without redeploying code.

### 3. Crawl Jobs

Track every admin-triggered or scheduled operation:

- job type
- job status
- who triggered it
- filters used
- start and finish timestamps
- error message

Job types:

- `global_ingest`
- `source_sync`
- `user_rematch`
- `all_users_rematch` (see operational bounds below)

Statuses:

- `pending`
- `running`
- `completed`
- `failed`

#### Error Handling and Resilience

**Job Idempotency:**

- `global_ingest`: **Idempotent** - Scholarship upserts use natural keys (source_url + source_key); safe to retry
- `source_sync`: **Idempotent** - Same as global ingest but scoped to specific sources
- `user_rematch`: **Idempotent** - Deletes and recreates all matches for target user; safe to retry
- `all_users_rematch`: **Idempotent** - Processes each user independently; can resume from last successful user

**Retry Strategy:**

- **Automatic retry**: Not implemented (v1); failed jobs require manual intervention
- **Manual retry**: Admin can resubmit failed jobs via admin UI or API
- **Retry limits**: Recommended max 3 automatic retries per job type (future enhancement)
- **Backoff strategy**: Exponential backoff with jitter (1s, 2s, 4s) for transient failures

**Duplicate Job Prevention:**

- Check for existing jobs with matching filters in `pending` or `running` status before creation
- Reject duplicate job creation with HTTP 409 Conflict
- Example: Reject new `source_sync` for country="Germany" if one is already running

**Job Timeouts:**

- `global_ingest`: 4 hours (configurable via `GLOBAL_INGEST_TIMEOUT_SECONDS`)
- `source_sync`: 1 hour (configurable via `SOURCE_SYNC_TIMEOUT_SECONDS`)
- `user_rematch`: 5 minutes (configurable via `USER_REMATCH_TIMEOUT_SECONDS`)
- `all_users_rematch`: 24 hours (configurable via `ALL_USERS_REMATCH_TIMEOUT_SECONDS`)
- Jobs exceeding timeout are marked as `failed` with error message

**Atomicity and Compensation:**

- Scholarship upserts are atomic per record (transactional)
- `all_users_rematch` uses per-user transactions (commits after each user)
- Partial failure handling: Failed users are logged; job continues with remaining users
- Compensating actions: On failure, previously committed user matches remain valid

#### Operational Bounds for `all_users_rematch`

**Batching Strategy:**

- **Batch size**: Process 50 users per batch (configurable via `USER_MATCH_BATCH_SIZE`)
- **Cursor-based pagination**: Use user ID as cursor to avoid memory issues
- **Checkpointing**: Commit after each batch to enable resume on failure
- **Example**: 10,000 users → 200 batches of 50 users each

**Resource Limits and Throttling:**

- **Concurrent workers**: Max 5 concurrent user recompute operations (configurable via `MAX_CONCURRENT_REMATCH_WORKERS`)
- **Rate limiting**: 100 user recomputes per minute (configurable via `USER_REMATCH_RATE_LIMIT`)
- **Memory limit**: 2GB per worker process (configurable via `WORKER_MEMORY_LIMIT_MB`)
- **Database connections**: 1 connection per worker (pool size = `MAX_CONCURRENT_REMATCH_WORKERS` + 2)

**Job Prioritization:**

- `user_rematch` jobs **take priority** over `all_users_rematch`
- If a `user_rematch` is triggered while `all_users_rematch` is running:
  - Pause `all_users_rematch` after current batch completes
  - Process high-priority `user_rematch` job
  - Resume `all_users_rematch` from last checkpoint
- Admin can override prioritization via force flag

**Execution Time and Resource Estimates:**

Per batch of 50 users (estimated):

- **CPU**: 0.5 vCPU-seconds per user → ~25 vCPU-seconds per batch
- **Memory**: 100MB per worker process
- **Database I/O**: ~50 reads + 50 writes per user → ~5,000 operations per batch
- **Network**: Minimal (database queries only)
- **Estimated time**: 2-5 seconds per batch (varies by profile complexity)

**Monitoring and Alerts:**

- **Metrics to track**:
  - Batches completed vs. total batches
  - Users processed per second
  - Average batch duration
  - Failed user count and error types
- **Alert thresholds**:
  - Job running > 6 hours (warning) or > 12 hours (critical)
  - Failure rate > 5% of users
  - Batch duration > 30 seconds
- **Dashboards**: Real-time progress bar showing completed/total batches

### 4. Global Ingestion Pipeline

Execution flow:

1. scheduler or admin creates a crawl job
2. worker expands the relevant source set
3. TinyFish runs one source extraction per source URL
4. normalization maps TinyFish JSON into canonical scholarship candidates
5. ingestion layer upserts into the global `scholarships` table
6. downstream rematch jobs are queued for affected users

#### TinyFish Source Strategy

- use TinyFish source by source, not one giant regional run
- keep each run isolated for retries, billing control, and provenance
- submit multiple source runs together in small async batches
- aggregate status/result polling with TinyFish batch run lookup
- store TinyFish `run_id` on the source row for audit/debugging
- preserve raw extracted JSON on each scholarship record for reprocessing

**Affected User Scoping Rules:**

When new or updated scholarships are ingested, "affected users" are determined by:
- **Target country match**: Users whose `target_country` matches the scholarship's `country`
- **Degree level match**: Users whose `degree_level` matches the scholarship's `degree`
- **Minimal overlap**: Users must match BOTH criteria to avoid excessive recompute

**Operational Controls:**

To prevent cascading job creation:
- **Throttling**: Max 10 concurrent rematch jobs (configurable via `MAX_CONCURRENT_REMATCH_JOBS`)
- **Batching**: Rematch jobs are batched in 5-minute windows (configurable via `REMATCH_BATCH_WINDOW_SECONDS`)
- **Cooldown**: 30-minute debounce period per user (configurable via `USER_REMATCH_COOLDOWN_SECONDS`)
- **Priority**: Admin-triggered rematches take precedence over automatic rematches

**Example Scenario:**

If 50 new scholarships for "Masters" programs in "Germany" are ingested:
- Only users with `target_country="Germany"` AND `degree_level="Masters"` are queued for rematch
- These users are processed in batches of 10 concurrent jobs
- Users who received a rematch in the last 30 minutes are skipped
- Total jobs created: ~N/10 where N = matching user count (after cooldown filter)

### 5. User Match Pipeline

Execution flow:

1. profile create or profile update triggers a rematch job
2. new scholarship ingestion can trigger country-targeted or global rematch jobs
3. matching engine computes score and reasoning against canonical scholarships
4. results are stored in `user_scholarship_matches`
5. UI reads cached results ordered by highest score first

Ranking rules should strongly favor:

- exact target country match
- degree level match
- GPA and IELTS fit
- source confidence / official status
- deadline urgency

## Data Model

### Existing global table

- `scholarships`

### New global control-plane tables

- `scholarship_sources`
- `crawl_jobs`

### New user-derived table

- `user_scholarship_matches`

### Existing identity table extension

- add `role` to `users`

## API Surface

### Admin-only endpoints

- `GET /api/v1/admin/overview`
- `GET /api/v1/admin/sources`
- `GET /api/v1/admin/crawl-jobs`
- `POST /api/v1/admin/crawl-jobs`
- `POST /api/v1/admin/rematch-jobs`

### User-facing endpoints

- existing `POST /api/v1/match` can remain as live fallback
- production UI should eventually read cached user match snapshots

## Security & Authentication

### Authentication Mechanism

All admin endpoints use **session cookie authentication**:

- **Session cookie**: HttpOnly, SameSite=lax, secure flag in production
- **Cookie name**: Configurable via `SESSION_COOKIE_NAME` (default: `session`)
- **Session duration**: 7 days
- **Signing**: Sessions are signed using `SESSION_SECRET` to prevent tampering

### Authorization Enforcement

Admin role verification is enforced at the API layer via dependency injection:

- **Dependency**: `get_admin_user()` in `app/api/deps.py`
- **Check**: Validates `current_user.role == "admin"`
- **Failure**: Returns HTTP 403 Forbidden with "Admin access required"
- **Usage**: All `/api/v1/admin/*` endpoints include `current_user: User = Depends(get_admin_user)` parameter

**Implementation reference:**
```python
def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user
```

### Request Logging

Current middleware provides basic HTTP logging:

- **Middleware**: `RequestContextMiddleware` in `app/core/middleware.py`
- **Logged data**: Method, path, status code, duration, request ID
- **Request ID**: Generated or extracted from `X-Request-ID` header
- **Logger name**: `scholr.http`

### Production Recommendations

**Not yet implemented (required for production):**

1. **Audit Logging**: All admin actions should be logged with:
   - Admin user ID and email
   - Action performed (e.g., `create_crawl_job`, `trigger_rematch`)
   - Target resource (job ID, source key, user ID)
   - Timestamp and request ID
   - Changes made (before/after state for critical operations)

2. **Rate Limiting**: Admin endpoints should have:
   - Per-admin rate limits (e.g., 100 requests/minute)
   - Burst protection for expensive operations (rematch jobs)
   - Tiered limits based on operation cost (overview < source sync < all-users rematch)

3. **Additional Security Considerations**:
   - IP whitelisting for admin access in production
   - Multi-factor authentication (MFA) for admin accounts
   - Separate admin session timeout (shorter than user sessions)
   - Admin action confirmation for destructive operations

## Delivery Phases

### Phase 1

- admin role support
- source table
- job table
- user match snapshot table
- admin trigger/status endpoints

### Phase 2

- scheduler integration
- background worker for job execution
- source sync from crawler registry into DB
- rematch execution workers

### Phase 3

- admin frontend
- source health dashboard
- audit logs and retry tools

## Current Implementation Status

This repository now starts Phase 1 by adding:

- admin role support
- admin job models
- source registry table
- stored user match snapshots
- admin job trigger and listing endpoints

## Admin Bootstrap

Admin access is bootstrapped from backend environment variables:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_FULL_NAME`

On backend startup:

- if ADMIN_EMAIL is set and the user does not exist, create the admin user
- if ADMIN_EMAIL is set and the user exists with a non-admin role, log a warning (do not auto-promote)
- admin role management after initial bootstrap should be handled via admin UI or database migration

This gives production a deterministic initial admin credential path without exposing a public admin creation endpoint.

### Security Considerations

**Initial Password Usage:**

- `ADMIN_PASSWORD` is intended **only for initial bootstrap**
- After first login, the admin **should change their password** via the UI or API
- Treat the bootstrap password as a temporary credential (similar to default passwords)

**Environment Variable Behavior:**

- Subsequent backend restarts **do not overwrite** the stored password if admin user exists
- If `ADMIN_PASSWORD` is changed in environment variables after initial creation:
  - The database password **remains unchanged**
  - The new environment value **has no effect** until the admin user is deleted
- This design prevents accidental credential rotation via env var changes

**Recommended Secure Storage:**

For production deployments, avoid plain environment variables:

- **AWS Secrets Manager**: Store `ADMIN_PASSWORD` as encrypted secret
- **HashiCorp Vault**: Use Vault dynamic credentials or KV store
- **Kubernetes Secrets**: Use sealed secrets or external secret operators
- **CI/CD Integration**: Inject secrets at deployment time, never in code repos

**Password Rotation and Auditing:**

- **Initial setup**: Consider one-time use bootstrap password that expires on first login
- **Rotation**: Admin passwords should be rotated every 90 days (configurable)
- **Audit log**: Track password changes with admin user ID, timestamp, and request ID
- **Compromised credentials**: If bootstrap password is exposed:
  1. Immediately reset admin password via database direct access
  2. Revoke all active session cookies (invalidate session secret)
  3. Rotate `SESSION_SECRET` environment variable
  4. Audit all admin actions performed since compromise date

**Bootstrap Alternatives for Production:**

For higher security environments, consider:

- **Disable bootstrap**: Set `ADMIN_EMAIL=""` to disable auto-creation
- **Manual admin creation**: Use database migration or admin CLI tool
- **SAML/OIDC integration**: Use external identity provider for admin authentication
- **Just-in-time provisioning**: Create admin users via verified authentication flow

The worker/scheduler layer is still pending.
