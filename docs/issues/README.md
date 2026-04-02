# CodeRabbit Review - Active Tasks

**Review Date:** April 3, 2026
**Total Issues Found:** 75

---

## 📁 Purpose

This directory contains **detailed task files** for issues we're actively working on.

**For a quick reference catalog of ALL 75 issues, see:** [`../ISSUES.md`](../ISSUES.md)

---

## 📋 What's Here

Each file in this directory is a complete task guide with:
- ✅ Problem description
- ✅ Current code with issues
- ✅ Step-by-step fix implementation
- ✅ Testing checklist
- ✅ Rollback plan
- ✅ Estimated time

**Currently documented tasks:** 4 critical issues (see below)

---

## 🔴 Critical Issues (Ready to Fix)

---

## Quick Reference

### 🚨 Critical Issues (HIGH Priority)

| ID | Title | File | Type | Status |
|----|-------|------|------|--------|
| [#001](./001-gpa-input-handling.md) | Fix GPA Input Handling | `frontend/components/profile-form.tsx` | Bug Fix | ✅ COMPLETED |
| [#003](./003-pii-exposure-ai-prompts.md) | Fix PII Exposure in AI Prompts | `backend/app/ai_prompts/` | Security | ✅ COMPLETED |
| [#004](./004-missing-null-checks-crashes.md) | Add Missing Null Checks | `backend/app/services/` | Stability | ✅ COMPLETED |

### ⚠️ Important Issues (MEDIUM Priority)

| ID | Title | File | Type | Status |
|----|-------|------|------|--------|
| [#002](./002-full-name-submission.md) | Fix Full Name Submission | `frontend/app/settings/page.tsx` | Bug Fix | ✅ COMPLETED |
| | Missing API Response Validation | `backend/app/ai_providers/openai_provider.py` | Stability | TODO |
| | Invalid AI Provider Values | `backend/app/core/config.py` | Validation | TODO |
| | GLM Model Not Validated | `backend/app/ai_providers/glm_provider.py` | Validation | TODO |
| | Performance - Re-computation | `frontend/components/profile-form.tsx` | Performance | TODO |
| | Missing Accessibility | `frontend/app/settings/page.tsx` | Accessibility | TODO |

### 📝 Minor Issues (LOW Priority)

| ID | Title | File | Type | Status |
|----|-------|------|------|--------|
| | Redundant Condition | `frontend/components/profile-form.tsx` | Code Quality | TODO |
| | Forced Navigation Delay | `frontend/app/profile/page.tsx` | UX | TODO |
| | Missing Docstrings | `backend/app/ai_providers/base.py` | Documentation | TODO |

---

## Individual Task Files

### Critical Issues (Documented)

1. **[Task #001: Fix GPA Input Handling](./001-gpa-input-handling.md)**
   - **Priority:** HIGH
   - **Time:** 1-2 hours
   - **Impact:** Critical UX Issue
   - **Problems:**
     - Cannot clear the field (sets to 0 instead of undefined)
     - NaN propagation from invalid input
     - Poor typing UX (immediate clamping)
   - **Solution:** Deferred validation, proper empty handling, NaN protection

2. **[Task #002: Fix Full Name Submission](./002-full-name-submission.md)**
   - **Priority:** MEDIUM
   - **Time:** 30-60 minutes
   - **Impact:** Data Loss
   - **Problems:**
     - Full name uses defaultValue (uncontrolled)
     - Changes not captured on form submit
     - Data inconsistency
   - **Solution:** Make it a controlled component or extract from FormData

3. **[Task #003: Fix PII Exposure in AI Prompts](./003-pii-exposure-ai-prompts.md)**
   - **Priority:** HIGH SECURITY
   - **Time:** 2-3 hours
   - **Impact:** Privacy Violation, GDPR Risk
   - **Problems:**
     - Full profile JSON sent to AI services
     - PII exposure (email, DOB, resume URL)
     - Violates data minimization principles
   - **Solution:** Selective field serialization, only send necessary data

4. **[Task #004: Add Missing Null Checks](./004-missing-null-checks-crashes.md)**
   - **Priority:** HIGH STABILITY
   - **Time:** 1-2 hours
   - **Impact:** Application Crashes
   - **Problems:**
     - AttributeError on `.lower()` with None values
     - TypeError when iterating over None
     - Missing bounds checks on API responses
   - **Solution:** Comprehensive null checks, defensive programming

---

## Summary Matrix

### By Severity

| Severity | Count | Issues |
|----------|-------|--------|
| 🔴 Critical | 4 | #001, #003, #004, API response handling |
| 🟡 Important | 8 | #002, validation, performance, accessibility |
| 🟢 Minor | 63 | Code quality, documentation, UX improvements |

### By Type

| Type | Count | Examples |
|------|-------|----------|
| Bug Fix | 12 | GPA handling, null checks, full name |
| Security | 2 | PII exposure, data minimization |
| Stability | 8 | Crash prevention, error handling |
| Performance | 1 | Re-computation optimization |
| Accessibility | 1 | Missing ARIA attributes |
| Code Quality | 15 | Redundant conditions, missing docs |
| UX | 7 | Forced delays, typing issues |
| Validation | 6 | Missing null checks, type validation |

### By Component

| Component | Issues | Priority |
|-----------|--------|----------|
| Frontend Forms | 6 | HIGH |
| AI Services | 15 | HIGH |
| AI Providers | 8 | MEDIUM |
| Settings Page | 3 | MEDIUM |
| Profile Page | 2 | LOW |
| Other | 41 | MIXED |

---

## Recommended Fix Order

### Phase 1: Critical Stability & Security (Week 1)
1. ✅ **Task #001** - GPA Input (critical UX) ✅ COMPLETED
2. ✅ **Task #002** - Full Name Submission (data integrity) ✅ COMPLETED
3. ✅ **Task #003** - PII Exposure (security compliance) ✅ COMPLETED
4. ✅ **Task #004** - Missing Null Checks (prevents crashes) ✅ COMPLETED

### Phase 2: Important Functionality (Week 2)
4. ✅ **Task #002** - Full Name Submission (data integrity)
5. ✅ API Response Validation (stability)
6. ✅ AI Provider Validation (config safety)

### Phase 3: Quality & Polish (Week 3)
7. ✅ Performance Optimization (re-computation)
8. ✅ Accessibility Improvements (ARIA labels)
9. ✅ Code Quality (redundant conditions, docstrings)

---

## Creating Tasks from Issues

Each issue document includes:
- ✅ Clear problem description
- ✅ Current code with issues
- ✅ Recommended solution
- ✅ Testing checklist
- ✅ Rollback plan
- ✅ Related issues

### To Create a Task:

```bash
# From the project root
cd docs/issues

# Each issue is already documented in its own file
# Just copy the template and adjust as needed

# Example: Task #001
cp 001-gpa-input-handling.md TEMPLATE-task.md
# Edit TEMPLATE-task.md to create new task
```

### Task Template

```markdown
# Task #XXX: [Title]

**Priority:** HIGH/MEDIUM/LOW
**Status:** TODO/IN_PROGRESS/COMPLETED
**Estimated Time:** X hours
**Type:** Bug Fix/Security/Performance/etc.
**Impact:** Description

## Problem
[Clear description of the issue]

## Current Implementation
[Code showing the problem]

## Recommended Solution
[Code showing the fix]

## Testing Checklist
- [ ] Test case 1
- [ ] Test case 2

## Rollback Plan
[How to revert if needed]
```

---

## Progress Tracking

### Overall Progress

```
Total Issues: 75
├── Documented: 4 (critical issues)
├── In Progress: 0
└── Completed: 4

Completion: 5% (4/75 fixed, 4/75 documented)
```

### By Phase

```
Phase 1 (Critical): 4/4 completed ██████████ 100% ✅
Phase 2 (Important): 0/6 completed ░░░░░░░░░░ 0%
Phase 3 (Quality): 0/63 completed ░░░░░░░░░░ 0%
```

---

## Quick Start Guide

### For Developers

1. **Review the Issues:**
   ```bash
   # Read the main issues document
   cat docs/ISSUES.md

   # Read individual task files
   ls docs/issues/
   ```

2. **Pick a Task:**
   - Start with HIGH priority issues
   - Check dependencies in related issues
   - Review testing requirements

3. **Implement the Fix:**
   - Follow the recommended solution
   - Add tests as specified
   - Update the task file with progress

4. **Verify:**
   - Run the testing checklist
   - Update status to COMPLETED
   - Note any deviations from the plan

5. **Document:**
   - Add notes to the task file
   - Update related issues
   - Remove from TODO list

### For Project Managers

1. **Review Priority Matrix:**
   - Critical issues affect stability/security
   - Important issues affect functionality
   - Minor issues affect code quality

2. **Assign Tasks:**
   - Based on team expertise
   - Consider dependencies
   - Estimate completion time

3. **Track Progress:**
   - Update task statuses
   - Monitor completion rates
   - Adjust priorities as needed

---

## Statistics

### CodeRabbit Analysis

```
Analysis Type: Uncommitted Changes
Files Analyzed: 25+
Lines of Code: 5000+
Issues Found: 75

Breakdown:
- Backend: 45 issues
- Frontend: 20 issues
- Configuration: 10 issues
```

### Estimated Effort

```
Critical Issues: 6-8 hours
Important Issues: 4-6 hours
Minor Issues: 8-10 hours
────────────────────────────
Total: 18-24 hours

With Testing & Review: 24-32 hours
(3-4 days for 1 developer)
```

---

## Related Documentation

- [ISSUES.md](../ISSUES.md) - Complete review findings
- [BACKEND.md](../BACKEND.md) - Backend architecture
- [FRONTEND.md](../FRONTEND.md) - Frontend architecture
- [PROJECT_CONTEXT.md](../PROJECT_CONTEXT.md) - System overview

---

## Maintenance

### Updating This Index

When adding new issues:

1. Create new task file in `docs/issues/`
2. Update the summary matrix above
3. Add to appropriate table (Critical/Important/Minor)
4. Update progress tracking
5. Increment issue count

### Marking Issues Complete

When an issue is fixed:

1. Update task file status: `Status: COMPLETED`
2. Add completion notes
3. Update progress tracking
4. Move to completed section

---

**Last Updated:** April 3, 2026
**Next Review:** After Phase 1 completion
