# CodeRabbit Issues - Structure Guide

## 📁 Documentation Structure

We've organized the CodeRabbit review findings into two complementary locations:

---

## 1. `docs/ISSUES.md` - Quick Reference Catalog

**Purpose:** Complete catalog of all 75 issues at a glance

**Contains:**
- ✅ All issues listed with file, line numbers, and brief descriptions
- ✅ Issues grouped by severity (Critical, Important, Minor)
- ✅ Statistics and breakdown by component/type
- ✅ Links to detailed task files (when available)
- ✅ Recommended fix order (3 phases)

**Use it to:**
- Quickly scan what issues exist
- Find issues in specific files
- Get overview of problem areas
- See statistics and estimates

**Does NOT contain:**
- ❌ Detailed code snippets
- ❌ Step-by-step fixes
- ❌ Testing checklists
- ❌ Implementation guides

---

## 2. `docs/issues/` - Active Task Directory

**Purpose:** Detailed implementation guides for issues we're actively fixing

**Contains:**
- ✅ Individual task files (e.g., `001-gpa-input-handling.md`)
- ✅ Each file has complete implementation guide
- ✅ Includes code snippets, testing checklist, rollback plan
- ✅ `README.md` with task index and progress tracking

**Current tasks documented:**
- #001: GPA Input Handling
- #002: Full Name Submission
- #003: PII Exposure in AI Prompts
- #004: Missing Null Checks

**Use it to:**
- Get detailed fix implementation
- Follow step-by-step instructions
- Track task progress
- Create new task files

**When to create a new task file:**
- When you're about to fix an issue
- When an issue needs detailed investigation
- When multiple developers are working on issues

---

## 🚀 Quick Start

### I want to...

#### ...see what issues exist
→ Go to [`docs/ISSUES.md`](ISSUES.md)

#### ...fix a critical issue
→ Check if task file exists in [`docs/issues/`](issues/)
→ Use task file as guide, or create one if needed

#### ...track progress
→ Update status in [`docs/issues/README.md`](issues/README.md)

#### ...create a new task file
→ Copy an existing task file as template
→ Update with new issue details
→ Link from `ISSUES.md`

#### ...get overview of all findings
→ Read the statistics in [`docs/ISSUES.md`](ISSUES.md)

---

## 📊 Summary

| Location | Purpose | Content | Size |
|----------|---------|---------|------|
| `docs/ISSUES.md` | Quick reference catalog | All 75 issues, brief descriptions | ~500 lines |
| `docs/issues/` | Active task directory | Detailed task files (4 currently) | ~200 lines each |

---

## 🔄 Workflow

1. **Review issues** in `ISSUES.md`
2. **Select critical issue** to fix
3. **Check if task file exists** in `issues/`
4. **If yes:** Use it as implementation guide
5. **If no:** Create new task file (use existing as template)
6. **Update task status** in `issues/README.md`
7. **Mark complete** when done

---

## 📝 File Naming Convention

Task files follow this pattern:
```
XXX-title-with-dashes.md

Where:
XXX = Issue number (001, 002, etc.)
title-with-dashes = Brief descriptive title

Examples:
001-gpa-input-handling.md
002-full-name-submission.md
003-pii-exposure-ai-prompts.md
```

---

**Last Updated:** April 3, 2026
**Structure Version:** 1.0
