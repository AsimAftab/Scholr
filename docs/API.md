# Scholr API Reference

This document describes the current API contract at a practical level.

Base path:

```text
/api/v1
```

Base local URL:

```text
http://localhost:8000/api/v1
```

## Error Shape

Errors are normalized to:

```json
{
  "detail": "Human-readable message",
  "request_id": "optional-request-id"
}
```

## Auth

Auth uses a signed cookie session.

The frontend sends requests with `credentials: "include"`.

## 1. `POST /auth/signup`

Creates a user account and sets the session cookie.

Request:

```json
{
  "email": "user@example.com",
  "full_name": "Jane Doe",
  "password": "secret12"
}
```

Response:

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "Jane Doe",
    "profile": null
  }
}
```

## 2. `POST /auth/login`

Logs in an existing user and sets the session cookie.

Request:

```json
{
  "email": "user@example.com",
  "password": "secret12"
}
```

Response:

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "Jane Doe",
    "profile": null
  }
}
```

## 3. `POST /auth/logout`

Clears the session cookie.

Response:

```json
{
  "status": "ok"
}
```

## 4. `GET /auth/me`

Returns the current authenticated user.

Auth required:

- yes

Response:

```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "Jane Doe",
  "profile": {
    "id": 10,
    "country": "Nepal",
    "target_country": "Canada",
    "degree": "Masters",
    "gpa": 3.4,
    "ielts_score": 6.5
  }
}
```

## 5. `POST /profile`

Creates or updates the authenticated user profile.

Auth required:

- yes

Request:

```json
{
  "country": "Nepal",
  "target_country": "Canada",
  "degree": "Masters",
  "gpa": 3.4,
  "ielts_score": 6.5
}
```

Response:

```json
{
  "id": 10,
  "country": "Nepal",
  "target_country": "Canada",
  "degree": "Masters",
  "gpa": 3.4,
  "ielts_score": 6.5
}
```

## 6. `GET /scholarships`

Returns all scholarships currently stored in the database.

Auth required:

- no

Response:

```json
[
  {
    "id": 1,
    "title": "Maple Global Graduate Scholarship",
    "country": "Canada",
    "degree": "Masters",
    "source_url": "https://example.org/maple-global-graduate",
    "deadline": "2026-07-15",
    "eligibility_text": "Applicants must have ...",
    "structured_eligibility": {
      "gpa_required": 3.2,
      "ielts_required": 6.5,
      "documents_required": ["SOP", "LOR", "CV", "Transcript"]
    }
  }
]
```

## 7. `POST /match`

Returns scholarship matches for the authenticated user profile.

Auth required:

- yes

Response:

```json
{
  "matches": [
    {
      "scholarship_id": 1,
      "title": "Maple Global Graduate Scholarship",
      "country": "Canada",
      "deadline": "2026-07-15",
      "match_score": 90,
      "missing_requirements": [],
      "summary": "Maple Global Graduate Scholarship supports ..."
    }
  ]
}
```

## 8. `POST /generate-sop`

Generates SOP content for a scholarship using the authenticated user profile.

Auth required:

- yes

Request:

```json
{
  "scholarship_id": 1
}
```

Response:

```json
{
  "content": "I am applying for ..."
}
```

## 9. `POST /generate-lor`

Generates a LOR template for a scholarship using the authenticated user profile.

Auth required:

- yes

Request:

```json
{
  "scholarship_id": 1
}
```

Response:

```json
{
  "content": "To the scholarship committee ..."
}
```

## 10. `POST /summarize-scholarship`

Summarizes a scholarship.

Auth required:

- yes

Request:

```json
{
  "scholarship_id": 1
}
```

Response:

```json
{
  "content": "This scholarship ..."
}
```

## 11. `POST /scholarships/structure`

Structures raw eligibility text into machine-readable fields.

Auth required:

- no

Request:

```json
{
  "eligibility_text": "Applicants must have a minimum GPA of 3.0 and IELTS score of 6.5"
}
```

Response:

```json
{
  "gpa_required": 3.0,
  "ielts_required": 6.5,
  "documents_required": ["SOP", "LOR", "CV"],
  "degree_levels": [],
  "countries_allowed": []
}
```

## 12. `GET /health`

Basic health endpoint.

Response:

```json
{
  "status": "ok"
}
```

## 13. `GET /ready`

Readiness endpoint that checks DB availability.

Response:

```json
{
  "status": "ready"
}
```

## Notes For Future API Changes

- Preserve the normalized error contract unless doing a deliberate breaking change.
- Keep auth cookie-based unless intentionally redesigning the auth model.
- Add versioning discipline if introducing major endpoint changes.

