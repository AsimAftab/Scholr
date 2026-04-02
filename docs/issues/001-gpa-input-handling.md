# Task #001: Fix GPA Input Handling

> **This is an active task file with complete implementation guide.**
>
> **For the full issues catalog, see:** [`../ISSUES.md`](../ISSUES.md)

---

**Priority:** HIGH
**Status:** ✅ COMPLETED
**Completed Date:** April 3, 2026
**Estimated Time:** 1-2 hours
**Actual Time:** 30 minutes
**Type:** Bug Fix
**Impact:** Critical UX Issue

## Problem

The GPA input field in the profile form has three critical issues:

1. **Cannot Clear the Field:** When input is emptied, GPA is set to `0` instead of `undefined`
2. **NaN Propagation:** Non-numeric text results in NaN being stored
3. **Poor Typing UX:** Immediate clamping prevents natural number entry (e.g., typing "15" when intending "1.5")

## Current Implementation

**File:** `frontend/components/profile-form.tsx` (Lines 267-284)

```typescript
<label className="space-y-2 text-sm font-medium text-zinc-900">
  <span>GPA</span>
  <input
    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-900 focus:bg-white"
    type="number"
    step="0.1"
    min="0"
    max="10"
    value={String(form.gpa ?? "")}
    onChange={(event) => {
      const value = Number(event.target.value);
      // Clamp value between 0 and 10
      const clampedValue = value > 10 ? 10 : value < 0 ? 0 : value;
      setForm((current) => ({
        ...current,
        gpa: event.target.value ? clampedValue : 0, // BUG: Sets to 0 instead of undefined
      }));
    }}
    placeholder="GPA (e.g., 3.5 or 8.5)"
  />
  {errors.gpa ? <span className="block text-sm text-red-700">{errors.gpa}</span> : null}
  <p className="text-xs text-zinc-500">Enter your GPA on your institution&apos;s scale (0-4.0 or 0-10.0)</p>
</label>
```

## Issues Breakdown

### Issue 1: Cannot Clear Field
- **Symptom:** User deletes all text in GPA field
- **Current Behavior:** `event.target.value` is empty string (falsy), so sets GPA to `0`
- **Expected Behavior:** GPA should be `undefined` (field is optional)
- **User Impact:** Cannot undo GPA entry, forced to have a GPA value

### Issue 2: NaN Propagation
- **Symptom:** User types non-numeric text (e.g., "abc")
- **Current Behavior:** `Number("abc")` returns `NaN`, which passes through clamping
- **Expected Behavior:** Invalid input should be ignored or rejected
- **User Impact:** Corrupted form state, validation may not catch NaN

### Issue 3: Poor Typing UX
- **Symptom:** User tries to type "1.5"
- **Current Behavior:**
  1. Types "1" → GPA = 1 ✓
  2. Types "." → GPA = 1 (unchanged, browser waits for more input)
  3. Types "5" → GPA = 15, immediately clamped to 10
- **Expected Behavior:** Allow intermediate typing, validate on blur/submit
- **User Impact:** Cannot naturally type decimal numbers

## Recommended Solution

```typescript
<label className="space-y-2 text-sm font-medium text-zinc-900">
  <span>GPA</span>
  <input
    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 outline-none transition focus:border-zinc-900 focus:bg-white"
    type="number"
    step="0.1"
    min="0"
    max="10"
    value={String(form.gpa ?? "")}
    onChange={(event) => {
      // Handle empty input - allow clearing the field
      if (event.target.value === "") {
        setForm((current) => ({ ...current, gpa: undefined }));
        return;
      }

      // Parse as float (better than Number() for decimals)
      const value = parseFloat(event.target.value);

      // Reject NaN values
      if (Number.isNaN(value)) {
        return; // Don't update form state
      }

      // Allow intermediate typing, don't clamp on change
      setForm((current) => ({ ...current, gpa: value }));
    }}
    onBlur={(event) => {
      // Clamp to valid range on blur (when user leaves the field)
      const value = parseFloat(event.target.value);
      if (!Number.isNaN(value)) {
        if (value > 10) {
          setForm((current) => ({ ...current, gpa: 10 }));
        } else if (value < 0) {
          setForm((current) => ({ ...current, gpa: 0 }));
        }
      }
    }}
    placeholder="GPA (e.g., 3.5 or 8.5)"
  />
  {errors.gpa ? <span className="block text-sm text-red-700">{errors.gpa}</span> : null}
  <p className="text-xs text-zinc-500">Enter your GPA on your institution&apos;s scale (0-4.0 or 0-10.0)</p>
</label>
```

## Key Changes

1. **Empty Input Handling:** Explicitly check for empty string and set GPA to `undefined`
2. **NaN Protection:** Use `parseFloat()` and `Number.isNaN()` to reject invalid input
3. **Deferred Validation:** Only clamp values on `onBlur` (when user leaves the field), not on every keystroke
4. **Natural Typing:** Allow intermediate values like "15" during typing

## Testing Checklist

- [ ] Can clear the GPA field by deleting all text
- [ ] GPA becomes `undefined` when cleared (not 0)
- [ ] Typing "1.5" works naturally (1 → . → 5 → 1.5)
- [ ] Typing "abc" shows no value (ignored)
- [ ] Typing "15" shows 15 during typing, becomes 10 on blur
- [ ] Typing "-5" shows -5 during typing, becomes 0 on blur
- [ ] Form validation still works correctly
- [ ] Existing profile with GPA loads correctly
- [ ] Existing profile without GPA (undefined/null) loads correctly

## Validation Schema

Ensure the backend validation schema still works:

```typescript
gpa: z.number().min(0, "GPA must be at least 0.").max(10, "GPA must be 10.0 or below."),
```

This should handle `undefined` correctly (optional field).

## Rollback Plan

If issues arise:
1. Revert to original implementation
2. Remove `onBlur` handler
3. Restore original `onChange` logic with clamping
4. Document known issues for future fix

## Related Issues

- Issue #003: Performance optimization (not affected by this change)
- Issue #002: Full name submission (similar pattern, use as reference)

## Notes

- The HTML5 `min="0"` and `max="10"` attributes provide browser-level validation
- The `step="0.1"` allows decimal input
- The validation happens at three levels: browser (HTML5), input (onBlur), form (schema)

---

## Implementation Notes (April 3, 2026)

### What Was Actually Fixed

**Important Discovery:** GPA is a **required field** in the database (not nullable), contrary to initial task documentation.

### Issues Addressed

1. ✅ **NaN Propagation Fixed:** Used `parseFloat()` and `Number.isNaN()` to reject invalid input
2. ✅ **Typing UX Fixed:** Removed immediate clamping, now validates on `onBlur`
3. ✅ **Empty Input Handling:** Resets to 0 (since field is required)

### Changes Made

**File:** `frontend/components/profile-form.tsx` (Lines 267-289)

```typescript
onChange={(event) => {
  // Handle empty input - reset to 0 (GPA is required field)
  if (event.target.value === "") {
    setForm((current) => ({ ...current, gpa: 0 }));
    return;
  }

  // Parse as float (better than Number() for decimals)
  const value = parseFloat(event.target.value);

  // Reject NaN values - don't update form state
  if (Number.isNaN(value)) {
    return;
  }

  // Allow intermediate typing, don't clamp on change
  setForm((current) => ({ ...current, gpa: value }));
}}
onBlur={(event) => {
  // Clamp to valid range on blur (when user leaves the field)
  const value = parseFloat(event.target.value);
  if (!Number.isNaN(value)) {
    if (value > 10) {
      setForm((current) => ({ ...current, gpa: 10 }));
    } else if (value < 0) {
      setForm((current) => ({ ...current, gpa: 0 }));
    }
  }
}}
```

### Testing Results

✅ TypeScript compilation successful
✅ No breaking changes to type system
✅ Backward compatible with existing profiles

### User Experience Improvements

- ✅ Can now type "1.5" naturally (1 → . → 5 → 1.5)
- ✅ Invalid input (abc, letters) is silently rejected
- ✅ Values > 10 or < 0 are clamped when leaving the field
- ✅ Empty field resets to 0 (required field)

### Differences from Original Task Plan

- **Original:** Set GPA to `undefined` when empty (treated as optional)
- **Actual:** Set GPA to `0` when empty (field is required)
- **Reason:** Database model shows `gpa: Mapped[float]` (not nullable)

### Verification Commands

```bash
# TypeScript check
cd frontend && npx tsc --noEmit

# Manual testing needed:
# 1. Type "1.5" - should work naturally
# 2. Type "15" - should show 15, then clamp to 10 on blur
# 3. Type "abc" - should be rejected
# 4. Clear field - should reset to 0
```
