# Job Runner Tasks

## Goal

Turn admin-created job rows into a working execution pipeline with:

- a background runner
- clear status transitions
- progress metrics
- execution logs
- source-by-source ingestion tracking
- admin UI polling for live updates

## Task Breakdown

### 1. Persistence

- extend `crawl_jobs` with:
  - `total_items`
  - `processed_items`
  - `success_count`
  - `failed_count`
  - `log_output`
  - `updated_at`

### 2. Execution Model

- create a single background runner loop inside backend startup
- pick oldest `pending` job
- transition it to `running`
- execute handler by job type
- transition to `completed` or `failed`

### 3. Job Types

- `global_ingest`
  - expand source set from filters
  - process sources one by one
  - update source timestamps
  - append logs and progress counters
- `source_sync`
  - same executor with a narrowed source set
- `user_rematch`
  - recompute match snapshots for one user
- `all_users_rematch`
  - recompute match snapshots for all profiled users

## Current Implementation Notes

- the ingestion runner is source-by-source and operationally complete
- it updates source freshness and job metrics now
- scholarship-page crawling and per-source extraction adapters can be plugged into the ingestion step next
- the admin UI polls the backend so status changes appear without a manual reload

## TinyFish Extraction Tasks

### 4. Source-by-Source TinyFish Ingestion

- add `TINYFISH_API_KEY`-backed extraction in the backend ingestion layer
- run one TinyFish extraction per source so failures, retries, and cost controls stay isolated
- fan out small async source batches, then aggregate their results back into one job
- capture TinyFish `run_id` on each source for audit/debugging
- persist source-level status:
  - `last_crawled_at`
  - `last_success_at`
  - `last_error`
  - `last_run_id`

### 5. Normalized Scholarship Storage

- extend the global `scholarships` table to keep:
  - normalized matching fields
  - funding metadata
  - eligible countries
  - fields/programs of study
  - raw extracted payload for reprocessing
- upsert records by stable scholarship detail URL

### 6. Extraction Contract

- TinyFish goal must return strict JSON only
- each source run returns a `scholarships` array
- every item should include, when available:
  - title
  - scholarship URL
  - host country
  - degree/program levels
  - funding / fully funded details
  - deadlines
  - eligibility summary
  - applicant countries
  - language / GPA requirements
  - required documents
  - programs / fields of study

### 7. Verification

- compile backend after schema/service changes
- run migrations
- rebuild backend container
- create a `global_ingest` job and confirm status moves:
  - `pending -> running -> completed/failed`
  - with per-source logs
