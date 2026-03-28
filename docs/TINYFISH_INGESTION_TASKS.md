# TinyFish Ingestion Tasks

## Goal

Use TinyFish as the production extraction engine in the ingestion layer, source by source, while keeping the global scholarship table normalized for matching.

## Delivery Steps

### 1. Config

- add `TINYFISH_API_KEY`
- add `TINYFISH_BASE_URL`
- add polling and timeout settings
- add `TINYFISH_BATCH_SIZE`

### 2. TinyFish Client

- submit async runs in small batches with `run-batch`
- poll grouped run IDs with `runs/batch`
- cap one batch at TinyFish's documented limit of 100 runs
- keep local operational default lower for cost and failure control

### 3. Extraction Prompt

- request strict JSON only
- extract all scholarship schemes on the source
- return missing fields as `null`
- include evidence/detail URLs

### 4. Normalization

- map TinyFish output into canonical scholarship fields
- preserve raw source payload for later reprocessing
- keep `structured_eligibility` rich enough for profile matching

### 5. Upsert

- upsert by scholarship detail URL
- update existing rows when the source returns fresher data
- track extraction timestamps

### 6. Runner Integration

- process enabled sources in small TinyFish batches
- aggregate completed results back into one parent ingest job
- write job progress after every source settles
- write source success/failure state after every source
- keep the rest of the job runner generic

## Expected Outcome

- admin-triggered ingestion jobs actually populate the global `scholarships` table
- failures stay isolated to the source that failed
- future fetchers can plug into the same normalized upsert path
