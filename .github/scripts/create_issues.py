#!/usr/bin/env python3
"""
Script to create GitHub issues from the ISSUES.md CodeRabbit review catalog.
Run via GitHub Actions with issues:write permission.
"""

import json
import os
import sys
import time
import urllib.request
import urllib.error

REPO = os.environ.get("GITHUB_REPOSITORY", "AsimAftab/Scholr")
TOKEN = os.environ.get("GITHUB_TOKEN", "")
API_BASE = "https://api.github.com"


def gh_request(method: str, path: str, body: dict | None = None) -> dict:
    url = f"{API_BASE}{path}"
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "Accept": "application/vnd.github+json",
            "Content-Type": "application/json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "Scholr-IssueCreator/1.0",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())


def ensure_labels(labels: list[dict]) -> None:
    """Create labels if they don't already exist."""
    existing = gh_request("GET", f"/repos/{REPO}/labels?per_page=100")
    existing_names = {lbl["name"] for lbl in existing}
    for lbl in labels:
        if lbl["name"] not in existing_names:
            try:
                gh_request("POST", f"/repos/{REPO}/labels", lbl)
                print(f"  Created label: {lbl['name']}")
            except urllib.error.HTTPError as exc:
                if exc.code == 422:
                    pass  # already exists
                else:
                    print(f"  Warning: could not create label {lbl['name']}: {exc}")


def create_issue(title: str, body: str, labels: list[str]) -> int | None:
    try:
        result = gh_request(
            "POST",
            f"/repos/{REPO}/issues",
            {"title": title, "body": body, "labels": labels},
        )
        number = result.get("number")
        print(f"  Created issue #{number}: {title}")
        time.sleep(0.5)  # avoid secondary rate limits
        return number
    except urllib.error.HTTPError as exc:
        print(f"  Error creating '{title}': HTTP {exc.code} {exc.reason}")
        return None


LABELS = [
    {"name": "bug", "color": "d73a4a", "description": "Something isn't working"},
    {"name": "security", "color": "e11d48", "description": "Security vulnerability or privacy concern"},
    {"name": "performance", "color": "0075ca", "description": "Performance improvement"},
    {"name": "accessibility", "color": "7057ff", "description": "Accessibility improvement"},
    {"name": "code quality", "color": "cfd3d7", "description": "Code quality improvement"},
    {"name": "documentation", "color": "0075ca", "description": "Improvements or additions to documentation"},
    {"name": "ux", "color": "e4e669", "description": "User experience improvement"},
    {"name": "validation", "color": "fbca04", "description": "Input or config validation"},
    {"name": "error handling", "color": "f9d0c4", "description": "Error handling improvement"},
    {"name": "configuration", "color": "bfd4f2", "description": "Configuration issue"},
    {"name": "refactoring", "color": "84b6eb", "description": "Code refactoring suggestion"},
    {"name": "high priority", "color": "b60205", "description": "High priority issue"},
    {"name": "medium priority", "color": "e4a609", "description": "Medium priority issue"},
    {"name": "low priority", "color": "0e8a16", "description": "Low priority issue"},
    {"name": "phase-1", "color": "c5def5", "description": "Phase 1: Critical Stability & Security"},
    {"name": "phase-2", "color": "bfe5bf", "description": "Phase 2: Important Functionality"},
    {"name": "phase-3", "color": "fef2c0", "description": "Phase 3: Quality & Polish"},
]

# ---------------------------------------------------------------------------
# Issue definitions — sourced from docs/ISSUES.md and docs/issues/*.md
# ---------------------------------------------------------------------------

ISSUES = [
    # ── PHASE 1: Critical ──────────────────────────────────────────────────
    {
        "title": "[Bug] Fix GPA Input Handling – cannot clear, NaN propagation, poor UX",
        "labels": ["bug", "high priority", "phase-1"],
        "body": """\
## Summary
The GPA input field in the profile form has three critical issues that degrade UX and corrupt form state.

**File:** `frontend/components/profile-form.tsx` – Lines 276-284

## Problems

### 1 – Cannot Clear the Field
When the input is emptied, GPA is set to `0` instead of `undefined`.
The user cannot undo an accidental GPA entry.

### 2 – NaN Propagation
Non-numeric text (e.g. `"abc"`) causes `Number(...)` to return `NaN`.
The clamping logic silently passes `NaN` through, corrupting form state.

### 3 – Poor Typing UX (Immediate Clamping)
Typing `"1.5"` is broken:
1. Type `"1"` → GPA = 1 ✓
2. Type `"."` → GPA = 1 (waits for more input)
3. Type `"5"` → GPA = 15, immediately clamped to **10** ✗

## Current Code (buggy)
```typescript
onChange={(event) => {
  const value = Number(event.target.value);
  const clampedValue = value > 10 ? 10 : value < 0 ? 0 : value;
  setForm((current) => ({
    ...current,
    gpa: event.target.value ? clampedValue : 0, // BUG: sets 0 instead of undefined
  }));
}}
```

## Recommended Fix
- Explicitly handle empty string → set `undefined` (or `0` if GPA is required)
- Use `parseFloat()` + `Number.isNaN()` to reject invalid input
- Move clamping to an `onBlur` handler so intermediate values are allowed

## Testing Checklist
- [ ] Can clear GPA field
- [ ] Typing `"1.5"` works naturally
- [ ] Typing `"abc"` is silently rejected
- [ ] Typing `"15"` shows 15 during typing, clamped to 10 on blur
- [ ] Form validation still works

## References
- Detailed task guide: `docs/issues/001-gpa-input-handling.md`
""",
    },
    {
        "title": "[Bug] Full Name Not Captured on Settings Form Submit",
        "labels": ["bug", "medium priority", "phase-2"],
        "body": """\
## Summary
The `full_name` input on the settings page uses `defaultValue` (uncontrolled component).
Changes the user makes are **not extracted** in `handleSave`, so the updated name is silently discarded.

**File:** `frontend/app/settings/page.tsx` – Lines 60-93

## Problem
```typescript
// Uncontrolled — changes are NOT tracked by React
<input
  defaultValue={user.full_name}
  ...
/>

// handleSave never reads this field from formData
const handleSave = (e: React.FormEvent) => {
  const formData = new FormData(e.currentTarget as HTMLFormElement);
  // full_name is never extracted!
  const newPassword = formData.get("newPassword") as string;
  ...
};
```

## Impact
Users who update their display name will see it appear to succeed (success toast) but the name is **never sent to the backend**.

## Recommended Fix
Convert the input to a controlled component with a `fullName` state variable and extract/submit it in `handleSave`.

## References
- Detailed task guide: `docs/issues/002-full-name-submission.md`
""",
    },
    {
        "title": "[Security] PII Exposure – Full Profile JSON Sent to External AI Services",
        "labels": ["security", "high priority", "phase-1"],
        "body": """\
## Summary
AI prompt builder functions serialize the **entire user profile** (including PII) and send it to external AI services. This violates GDPR/CCPA data-minimisation principles.

**Files:**
- `backend/app/ai_prompts/scholarship.py` – Lines 32-39, 51-80

## PII Being Exposed
`profile.model_dump_json()` includes:
- `email` – contact info
- `full_name` – personal identifier
- `date_of_birth` – sensitive personal data
- `resume_url` – can link to other personal data
- `id`, `created_at`, `updated_at` – internal metadata

## Current Code (vulnerable)
```python
# build_lor_prompt
profile_json = profile.model_dump_json()  # ❌ entire profile
user_prompt = f"Write a recommendation letter for:\nProfile: {profile_json}\n..."

# build_fit_scoring_prompt
profile_json = profile.model_dump_json()  # ❌ entire profile
user_prompt = f"Applicant Profile:\n{profile_json}\n..."
```

## Recommended Fix
Implement selective field serialization – only send the fields required for each AI task:

```python
# LOR: name + academic credentials only
applicant_summary = {
    "name": profile.full_name or "Student",
    "degree": profile.degree_level,
    "field_of_study": profile.field_of_study,
    "gpa": profile.gpa,
    "target_country": profile.target_country,
    "passout_year": profile.passout_year,
}

# Fit Scoring: academic/eligibility fields only (no name)
scoring_profile = {
    "degree": profile.degree_level,
    "field_of_study": profile.field_of_study,
    "gpa": profile.gpa,
    "target_country": profile.target_country,
    "passout_year": profile.passout_year,
    "ielts_score": profile.ielts_score,
}
```

## Compliance Impact
- GDPR Article 25 – Data Protection by Design
- GDPR Article 32 – Security of Processing
- CCPA – Right to Privacy / Data Minimisation

## References
- Detailed task guide: `docs/issues/003-pii-exposure-ai-prompts.md`
""",
    },
    {
        "title": "[Bug] Missing Null Checks Cause AttributeError / TypeError Crashes",
        "labels": ["bug", "high priority", "phase-1"],
        "body": """\
## Summary
Multiple locations perform string operations on potentially `None` values without null checks, causing runtime crashes when profile or scholarship data is incomplete.

**Files:**
- `backend/app/services/ai_service.py` – Lines 116-122
- `backend/app/ai_providers/openai_provider.py` – Line 39
- `backend/app/ai_providers/glm_provider.py` – Lines 10-16

## Crash Scenarios

### 1 – `AttributeError` on `.lower()` with `None`
```python
# ai_service.py:116
if profile.target_country.lower() == scholarship.country.lower():
    # ❌ AttributeError if target_country or country is None
```

### 2 – `TypeError` iterating over `None`
```python
# ai_service.py:118-122
if profile.field_of_study and any(
    field.lower() == profile.field_of_study.lower()
    for field in scholarship.field_of_study  # ❌ TypeError if field_of_study is None
):
```

### 3 – `IndexError` on empty choices list
```python
# openai_provider.py:39
content = response.choices[0].message.content or ""
# ❌ IndexError if choices list is empty
```

### 4 – `is_available` returns `True` when model is `None`
```python
# glm_provider.py:10-16
@property
def is_available(self) -> bool:
    return self.client is not None  # ❌ doesn't check self.model
```

## Recommended Fix
Add explicit null/bounds checks before all such operations.

## References
- Detailed task guide: `docs/issues/004-missing-null-checks-crashes.md`
""",
    },
    {
        "title": "[Bug] Missing Bounds Check Before Accessing `response.choices[0]` in OpenAI Provider",
        "labels": ["bug", "error handling", "high priority", "phase-1"],
        "body": """\
## Summary
`openai_provider.py` accesses `response.choices[0]` without first verifying the list is non-empty. An empty choices list from the OpenAI API (which can happen on certain error states) will raise an unhandled `IndexError`.

**File:** `backend/app/ai_providers/openai_provider.py` – Line 39

## Current Code
```python
content = response.choices[0].message.content or ""
```

## Recommended Fix
```python
if not response.choices:
    raise ValueError("OpenAI returned an empty choices list")
content = response.choices[0].message.content or ""
```

## References
- Related task: `docs/issues/004-missing-null-checks-crashes.md`
""",
    },
    {
        "title": "[Validation] Missing AI Provider Enum Validation in Config",
        "labels": ["validation", "medium priority", "phase-2"],
        "body": """\
## Summary
`backend/app/core/config.py` (Lines 18-19) accepts any string for `ai_provider` without validating against known values. An invalid value (e.g. a typo) silently passes validation and only fails at runtime when a provider is instantiated.

**File:** `backend/app/core/config.py` – Lines 18-19

## Recommended Fix
Use a `Literal` type or `Enum` to restrict valid values:
```python
from typing import Literal
ai_provider: Literal["openai", "glm", "ollama"] = "openai"
```

Or add a Pydantic validator that raises a helpful error at startup.
""",
    },
    {
        "title": "[Validation] GLM Provider `is_available` Does Not Validate Model Name",
        "labels": ["validation", "medium priority", "phase-2"],
        "body": """\
## Summary
`glm_provider.py` (Lines 10-16) returns `True` from `is_available` even when `self.model` is `None` or an empty string, causing a misleading availability check and an unclear failure later in `generate_text()`.

**File:** `backend/app/ai_providers/glm_provider.py` – Lines 10-16

## Current Code
```python
@property
def is_available(self) -> bool:
    return self.client is not None  # ❌ ignores model value
```

## Recommended Fix
```python
@property
def is_available(self) -> bool:
    return self.client is not None and bool(self.glm_model)
```
""",
    },

    # ── PHASE 2: Important ─────────────────────────────────────────────────
    {
        "title": "[Performance] Unnecessary Re-computation on Every Render in Profile Form",
        "labels": ["performance", "medium priority", "phase-2"],
        "body": """\
## Summary
`frontend/components/profile-form.tsx` (Lines 120-121) performs expensive computations on every render that could be memoized with `useMemo` or moved outside the component.

**File:** `frontend/components/profile-form.tsx` – Lines 120-121

## Impact
Causes unnecessary CPU work on each keystroke / state update in the profile form.

## Recommended Fix
Wrap the computation in `useMemo` with appropriate dependencies, or extract it as a static constant if the input is stable.
""",
    },
    {
        "title": "[Code Quality] Redundant Condition in Profile Form",
        "labels": ["code quality", "low priority", "phase-3"],
        "body": """\
## Summary
`frontend/components/profile-form.tsx` (Lines 127-130) contains a redundant conditional check that always evaluates to the same branch.

**File:** `frontend/components/profile-form.tsx` – Lines 127-130

## Recommended Fix
Simplify the condition to remove the redundant branch, reducing cognitive overhead.
""",
    },
    {
        "title": "[Accessibility] Missing ARIA Attributes in Settings Form",
        "labels": ["accessibility", "medium priority", "phase-2"],
        "body": """\
## Summary
The settings page form (Lines 159-192) is missing ARIA attributes that screen readers and assistive technologies rely on. This makes the settings page inaccessible to users with disabilities.

**File:** `frontend/app/settings/page.tsx` – Lines 159-192

## Missing Attributes
- `aria-label` / `aria-describedby` on form fields
- `aria-live` regions for success/error messages
- `role` attributes where needed

## Recommended Fix
Add appropriate ARIA attributes to all interactive form elements and dynamic message regions.
""",
    },
    {
        "title": "[UX] Forced Navigation Delay on Profile Page",
        "labels": ["ux", "low priority", "phase-3"],
        "body": """\
## Summary
`frontend/app/profile/page.tsx` (Lines 95-99) uses an artificial `setTimeout` delay before navigating away, creating a poor user experience. Users are forced to wait unnecessarily.

**File:** `frontend/app/profile/page.tsx` – Lines 95-99

## Recommended Fix
Remove the artificial delay and navigate immediately after the async operation completes, or replace it with proper loading state management.
""",
    },

    # ── PHASE 2 / 3: Backend AI Providers ─────────────────────────────────
    {
        "title": "[Documentation] Missing Docstring for Abstract Method in AI Provider Base Class",
        "labels": ["documentation", "low priority", "phase-3"],
        "body": """\
## Summary
The abstract method(s) in `backend/app/ai_providers/base.py` (Lines 21-29) lack docstrings, making it unclear what contract implementing classes must fulfill.

**File:** `backend/app/ai_providers/base.py` – Lines 21-29

## Recommended Fix
Add docstrings to all abstract methods describing parameters, return types, and any expected exceptions.
""",
    },
    {
        "title": "[Error Handling] Insufficient Error Handling in Ollama Provider",
        "labels": ["error handling", "medium priority", "phase-2"],
        "body": """\
## Summary
`backend/app/ai_providers/ollama_provider.py` lacks sufficient error handling for network failures, timeouts, and unexpected response formats from the Ollama API.

**File:** `backend/app/ai_providers/ollama_provider.py`

## Recommended Fix
- Wrap HTTP calls in try/except blocks
- Handle `ConnectionError`, `TimeoutError`, and unexpected status codes gracefully
- Return informative error messages instead of propagating raw exceptions
""",
    },
    {
        "title": "[Code Quality] Minor Improvements Needed in Ollama Provider",
        "labels": ["code quality", "low priority", "phase-3"],
        "body": """\
## Summary
`backend/app/ai_providers/ollama_provider.py` has minor code quality issues flagged in the CodeRabbit review (nitpick level).

**File:** `backend/app/ai_providers/ollama_provider.py`

## Recommended Fix
Address nitpick-level suggestions from the CodeRabbit review to improve readability and maintainability.
""",
    },
    {
        "title": "[Code Quality] Minor Improvements Needed in Multi-Provider Module",
        "labels": ["code quality", "low priority", "phase-3"],
        "body": """\
## Summary
`backend/app/ai_providers/multi_provider.py` has minor code quality issues flagged in the CodeRabbit review (nitpick level).

**File:** `backend/app/ai_providers/multi_provider.py`

## Recommended Fix
Address nitpick-level suggestions from the CodeRabbit review to improve readability and maintainability.
""",
    },
    {
        "title": "[Error Handling] Insufficient Error Handling in AI Provider Registry",
        "labels": ["error handling", "medium priority", "phase-2"],
        "body": """\
## Summary
`backend/app/ai_providers/registry.py` does not handle the case where an unknown provider name is requested, potentially causing an unhandled exception.

**File:** `backend/app/ai_providers/registry.py`

## Recommended Fix
- Raise a descriptive `ValueError` when an unknown provider is requested
- Log available providers in the error message
""",
    },
    {
        "title": "[Code Quality] Minor Improvements Needed in GLM Provider",
        "labels": ["code quality", "low priority", "phase-3"],
        "body": """\
## Summary
`backend/app/ai_providers/glm_provider.py` has minor code quality issues flagged in the CodeRabbit review (nitpick level).

**File:** `backend/app/ai_providers/glm_provider.py`

## Recommended Fix
Address nitpick-level suggestions from the CodeRabbit review to improve readability and maintainability.
""",
    },

    # ── Security – AI Prompts ──────────────────────────────────────────────
    {
        "title": "[Security] PII Exposure in LOR Prompt Builder – Send Only Necessary Fields",
        "labels": ["security", "high priority", "phase-1"],
        "body": """\
## Summary
`build_lor_prompt()` in `backend/app/ai_prompts/scholarship.py` (Lines 32-39) sends the full profile JSON to the external AI service, exposing PII.

**File:** `backend/app/ai_prompts/scholarship.py` – Lines 32-39

## Recommended Fix
Replace `profile.model_dump_json()` with a selective dict containing only: name, degree, field_of_study, gpa, target_country, passout_year.

See the parent issue for full details.
""",
    },
    {
        "title": "[Security] PII Exposure in Fit-Scoring Prompt Builder – Send Only Necessary Fields",
        "labels": ["security", "high priority", "phase-1"],
        "body": """\
## Summary
`build_fit_scoring_prompt()` in `backend/app/ai_prompts/scholarship.py` (Lines 51-80) sends the full profile JSON to the external AI service, exposing PII.

**File:** `backend/app/ai_prompts/scholarship.py` – Lines 51-80

## Recommended Fix
Replace `profile.model_dump_json()` with a selective dict containing only: degree, field_of_study, gpa, target_country, passout_year, ielts_score.

See the parent issue for full details.
""",
    },
    {
        "title": "[Security] Review Additional PII Concerns in Scholarship Prompt Builders",
        "labels": ["security", "medium priority", "phase-2"],
        "body": """\
## Summary
Beyond the two identified prompt functions, other prompt builders in `backend/app/ai_prompts/scholarship.py` may also send unnecessary profile data to external AI services.

**File:** `backend/app/ai_prompts/scholarship.py`

## Recommended Fix
Audit all prompt builder functions and ensure each sends only the minimum required profile fields.
""",
    },

    # ── Config ─────────────────────────────────────────────────────────────
    {
        "title": "[Validation] Missing Validation for Config Values in `core/config.py`",
        "labels": ["validation", "medium priority", "phase-2"],
        "body": """\
## Summary
`backend/app/core/config.py` may lack validation for several configuration values beyond the `ai_provider` field (Lines 18-19). Invalid configuration is only caught at runtime, not at startup.

**File:** `backend/app/core/config.py`

## Recommended Fix
Add Pydantic validators (`@field_validator`) for all critical configuration fields to fail fast at application startup with a descriptive error message.
""",
    },

    # ── Backend Services ───────────────────────────────────────────────────
    {
        "title": "[Error Handling] Insufficient Error Handling in Admin Service",
        "labels": ["error handling", "medium priority", "phase-2"],
        "body": """\
## Summary
`backend/app/services/admin_service.py` lacks sufficient error handling for edge cases, which may result in unhandled exceptions propagating to the API layer.

**File:** `backend/app/services/admin_service.py`

## Recommended Fix
- Add try/except blocks around database operations
- Return structured error responses instead of propagating raw exceptions
- Log errors with sufficient context for debugging
""",
    },
    {
        "title": "[Bug] Missing Null Check for `profile.target_country` and `scholarship.country` in AI Service",
        "labels": ["bug", "high priority", "phase-1"],
        "body": """\
## Summary
`backend/app/services/ai_service.py` (Lines 116-122) calls `.lower()` on `profile.target_country` and `scholarship.country` without checking for `None`, causing an `AttributeError` when either field is unset.

**File:** `backend/app/services/ai_service.py` – Lines 116-122

## Current Code
```python
if profile.target_country.lower() == scholarship.country.lower():
    positives.append("Target country aligns with the scholarship destination")
    rule_score += 3
```

## Recommended Fix
```python
if (
    profile.target_country
    and scholarship.country
    and profile.target_country.lower() == scholarship.country.lower()
):
    positives.append("Target country aligns with the scholarship destination")
    rule_score += 3
```
""",
    },
    {
        "title": "[Bug] Missing Null Check for `scholarship.field_of_study` in AI Service",
        "labels": ["bug", "high priority", "phase-1"],
        "body": """\
## Summary
`backend/app/services/ai_service.py` (Lines 118-122) iterates over `scholarship.field_of_study` without checking that it is not `None`, causing a `TypeError` when the field is unset.

**File:** `backend/app/services/ai_service.py` – Lines 118-122

## Current Code
```python
if profile.field_of_study and any(
    field.lower() == profile.field_of_study.lower()
    for field in scholarship.field_of_study  # ❌ TypeError if None
):
```

## Recommended Fix
```python
if (
    profile.field_of_study
    and scholarship.field_of_study
    and any(
        field.lower() == profile.field_of_study.lower()
        for field in scholarship.field_of_study
    )
):
```
""",
    },

    # ── Backend Models ─────────────────────────────────────────────────────
    {
        "title": "[Code Quality] Minor Improvements in `user_scholarship_match.py` Model",
        "labels": ["code quality", "low priority", "phase-3"],
        "body": """\
## Summary
`backend/app/models/user_scholarship_match.py` has minor code quality issues flagged in the CodeRabbit review (nitpick level).

**File:** `backend/app/models/user_scholarship_match.py`

## Recommended Fix
Address nitpick-level suggestions from the CodeRabbit review to improve readability and maintainability.
""",
    },

    # ── Backend Env Files ──────────────────────────────────────────────────
    {
        "title": "[Configuration] Missing or Incorrect Variables in `backend/.env.development.example`",
        "labels": ["configuration", "medium priority", "phase-2"],
        "body": """\
## Summary
The development environment example file (`backend/.env.development.example`) is missing required variables or contains incorrect default values, which can cause issues when onboarding new developers.

**File:** `backend/.env.development.example`

## Recommended Fix
- Audit all required environment variables against `backend/app/core/config.py`
- Add any missing variables with sensible development defaults
- Add inline comments explaining the purpose of each variable
""",
    },
    {
        "title": "[Configuration] Additional Environment Variable Issues in `backend/.env.development.example`",
        "labels": ["configuration", "low priority", "phase-3"],
        "body": """\
## Summary
Further environment variable issues were identified in `backend/.env.development.example` beyond the primary configuration issue. These affect developer experience.

**File:** `backend/.env.development.example`

## Recommended Fix
Review and correct all remaining environment variable issues flagged in the CodeRabbit review.
""",
    },
    {
        "title": "[Configuration] Production Config Issues in `backend/.env.production.example`",
        "labels": ["configuration", "medium priority", "phase-2"],
        "body": """\
## Summary
The production environment example file (`backend/.env.production.example`) contains issues that may lead to misconfigured production deployments.

**File:** `backend/.env.production.example`

## Recommended Fix
- Ensure all production-required variables are listed with clear documentation
- Remove any development-only defaults
- Add security-critical variables (e.g. `SESSION_SECRET`, `DATABASE_URL`) with placeholder values and warnings
""",
    },

    # ── Frontend Components ────────────────────────────────────────────────
    {
        "title": "[Bug] Error Handling / Validation Issues in `scholarship-list.tsx`",
        "labels": ["bug", "error handling", "medium priority", "phase-2"],
        "body": """\
## Summary
`frontend/components/scholarship-list.tsx` has error handling or input validation issues flagged in the CodeRabbit review.

**File:** `frontend/components/scholarship-list.tsx`

## Recommended Fix
- Add appropriate error boundaries or error state handling
- Validate props/data before rendering to prevent runtime errors
""",
    },
    {
        "title": "[Bug] Additional Issues in `scholarship-list.tsx`",
        "labels": ["bug", "medium priority", "phase-2"],
        "body": """\
## Summary
Additional potential issues were identified in `frontend/components/scholarship-list.tsx` beyond the primary error handling concern.

**File:** `frontend/components/scholarship-list.tsx`

## Recommended Fix
Review and address all secondary issues flagged in the CodeRabbit review for this component.
""",
    },
    {
        "title": "[Code Quality] Type Annotation Improvements in `frontend/lib/types.ts`",
        "labels": ["code quality", "low priority", "phase-3"],
        "body": """\
## Summary
`frontend/lib/types.ts` has type annotation nitpicks flagged in the CodeRabbit review that reduce type safety.

**File:** `frontend/lib/types.ts`

## Recommended Fix
Tighten type annotations to use more specific types rather than `any` or overly broad unions.
""",
    },
    {
        "title": "[Refactoring] API Response Handling Improvements in `frontend/lib/api.ts`",
        "labels": ["refactoring", "medium priority", "phase-2"],
        "body": """\
## Summary
`frontend/lib/api.ts` was flagged with a refactor suggestion to improve API response handling — likely around error propagation and response shape validation.

**File:** `frontend/lib/api.ts`

## Recommended Fix
- Centralise error handling logic (e.g. check for `detail` + `request_id` shape)
- Add response schema validation where beneficial
- Reduce code duplication across fetch calls
""",
    },

    # ── Frontend Pages ─────────────────────────────────────────────────────
    {
        "title": "[Bug] Error Handling Issues in `frontend/app/scholarships/page.tsx`",
        "labels": ["bug", "error handling", "medium priority", "phase-2"],
        "body": """\
## Summary
`frontend/app/scholarships/page.tsx` has error handling or validation issues flagged in the CodeRabbit review.

**File:** `frontend/app/scholarships/page.tsx`

## Recommended Fix
Add proper error state handling, loading states, and user-facing error messages for failed API calls.
""",
    },
    {
        "title": "[Configuration] Build Configuration Issues in `frontend/tsconfig.tsbuildinfo`",
        "labels": ["configuration", "low priority", "phase-3"],
        "body": """\
## Summary
`frontend/tsconfig.tsbuildinfo` has build configuration nitpicks flagged in the CodeRabbit review.

**File:** `frontend/tsconfig.tsbuildinfo`

## Note
This file is auto-generated by TypeScript. The issue likely relates to the underlying `tsconfig.json` settings that generate it.

## Recommended Fix
Review `tsconfig.json` for configuration improvements as suggested in the CodeRabbit review.
""",
    },

    # ── Documentation ──────────────────────────────────────────────────────
    {
        "title": "[Documentation] Issues in Root `GEMINI.md`",
        "labels": ["documentation", "low priority", "phase-3"],
        "body": """\
## Summary
The root-level `GEMINI.md` has documentation issues flagged in the CodeRabbit review.

**File:** `GEMINI.md`

## Recommended Fix
Review and correct the documentation issues to ensure the file accurately represents the project for AI coding assistants.
""",
    },
    {
        "title": "[Documentation] Additional Issues in Root `GEMINI.md`",
        "labels": ["documentation", "low priority", "phase-3"],
        "body": """\
## Summary
Additional documentation issues were identified in the root-level `GEMINI.md` beyond the primary concern.

**File:** `GEMINI.md`

## Recommended Fix
Address all secondary documentation issues flagged in the CodeRabbit review.
""",
    },
    {
        "title": "[Documentation] Documentation Issues in `frontend/GEMINI.md`",
        "labels": ["documentation", "low priority", "phase-3"],
        "body": """\
## Summary
`frontend/GEMINI.md` has documentation issues flagged in the CodeRabbit review that may mislead AI coding assistants working on the frontend.

**File:** `frontend/GEMINI.md`

## Recommended Fix
Review and correct all documentation issues to ensure the file accurately represents the frontend architecture and conventions.
""",
    },
]


def main() -> None:
    if not TOKEN:
        print("ERROR: GITHUB_TOKEN is not set", file=sys.stderr)
        sys.exit(1)

    print(f"Creating labels in {REPO} …")
    ensure_labels(LABELS)

    print(f"\nCreating {len(ISSUES)} issues in {REPO} …")
    created = 0
    failed = 0
    for issue in ISSUES:
        number = create_issue(issue["title"], issue["body"], issue["labels"])
        if number:
            created += 1
        else:
            failed += 1

    print(f"\nDone. Created: {created}  Failed: {failed}")
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main()
