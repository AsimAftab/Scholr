# Recent Improvements and Fixes

This document tracks the recent improvements made to the Scholr platform.

## Date: 2026-03-31

### Frontend Fixes

#### Profile Form
- **Added `passout_year` validation**: Added missing field to Zod schema with proper year range validation (1900-2110)
- **Added missing IELTS bands**: Added bands 2.5 and 3.5 to the IELTS score dropdown for complete coverage
- **Fixed IELTS field**: Changed from required to optional to match backend schema

#### Date Picker Component
- **Fixed focus stealing**: Added `wasOpen` ref to prevent focus stealing on component mount
- **Fixed unstable dialog ID**: Replaced `Math.random()` with React's `useId()` for stable IDs
- **Improved accessibility**: Added `aria-label` attributes to month and year select elements

#### Settings Page
- **Added name attributes**: Added `name="full_name"` to Full Name input so it's included in FormData
- **Prevented multiple submissions**: Added guard to prevent duplicate form submissions
- **Improved accessibility**: Added explicit `id`/`htmlFor` associations for form labels
- **Removed redundant validation**: Removed HTML5 `minLength` attributes, relying on JavaScript validation

#### Profile Page
- **Fixed setTimeout cleanup**: Added `isMounted` ref to guard navigation callback on component unmount

### Asset Improvements

#### Icons and Manifest
- **Created Apple touch icon PNG**: Generated 180x180px PNG from SVG (iOS compatibility)
- **Added PNG icon fallbacks**: Created 192x192 and 512x512 PNG icons (regular and maskable variants)
- **Fixed manifest.json**: Updated to include PNG fallbacks and corrected SVG purpose to "any" only

### Backend Fixes

#### Migrations
- **Fixed IELTS downgrade**: Changed NULL handling to use `-1` sentinel instead of `0` to preserve data semantics

#### Schemas
- **Refactored passout_year validation**: 
  - Removed unused `current_year` variable
  - Removed stale module-level `MAX_PASSOUT_YEAR` constant
  - Compute upper bound dynamically on each validation
  - Fixed unnecessary f-string

### Documentation Updates

#### Corrected Theme Documentation
- **CLAUDE.md**: Updated to clarify custom color tokens are planned but not implemented
- **GEMINI.md**: Updated theme guidance to reflect current neutral zinc palette
- **FRONTEND.md**: Updated theme system section to accurately describe current state
- **.github/copilot-instructions.md**: Fixed contradictory guidance about theme tokens

#### Domain Models
- **Added explicit primary keys**: Updated documentation to show `id` fields for Profile and Scholarship models
- **Clarified foreign keys**: Documented that `User.profile_id` references `Profile.id`
- **Updated field lists**: Added comprehensive field lists for all models including new fields

#### Security
- **Production environment**: Changed admin password placeholder from `test123` to `CHANGE_ME_TO_A_STRONG_PASSWORD`

### Accessibility Improvements
- **Improved text contrast**: Changed favicon preview text color from `#737373` to `#525252` for better WCAG compliance
- **Added ARIA labels**: Improved screen reader support in date picker and form inputs
- **Explicit label associations**: Added `id`/`htmlFor` attributes for better assistive technology support

## Impact

These improvements enhance:
- **Data integrity**: Proper handling of optional fields and NULL values
- **User experience**: Fixed focus issues, added missing form fields, prevented UI glitches
- **Accessibility**: Better screen reader support and WCAG compliance
- **Security**: Secure password placeholder prevents weak production passwords
- **Compatibility**: PNG icon fallbacks for older browsers and iOS devices
- **Developer experience**: Accurate documentation prevents confusion

## Files Modified

### Frontend
- `frontend/lib/validation.ts`
- `frontend/components/profile-form.tsx`
- `frontend/components/date-picker.tsx`
- `frontend/app/profile/page.tsx`
- `frontend/app/settings/page.tsx`
- `frontend/app/layout.tsx`
- `frontend/public/manifest.json`
- `frontend/public/favicon-preview.html`
- `frontend/public/apple-touch-icon.png` (created)
- `frontend/public/icon-192.png` (created)
- `frontend/public/icon-512.png` (created)
- `frontend/public/icon-maskable-192.png` (created)
- `frontend/public/icon-maskable-512.png` (created)

### Backend
- `backend/.env.production.example`
- `backend/app/schemas/profile.py`
- `backend/alembic/versions/20260401_0008_make_ielts_score_optional.py`

### Documentation
- `.github/copilot-instructions.md`
- `CLAUDE.md`
- `GEMINI.md`
- `README.md`
- `docs/FRONTEND.md`
- `docs/PROJECT_CONTEXT.md`

## Testing Recommendations

1. Test profile form submission with `passout_year` field
2. Verify IELTS score selection includes bands 2.5 and 3.5
3. Test date picker focus behavior on open/close
4. Test settings form with full name updates
5. Verify Apple touch icon displays correctly on iOS devices
6. Test PWA installation with new manifest icons
7. Verify migration downgrade handles NULL IELTS scores correctly
