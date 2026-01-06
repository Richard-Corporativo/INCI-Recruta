# Secure Candidate Application Flow

## Why
Currently, the distinction between Admin and Candidate flows is blurred at the routing level, causing security by obscurity concerns where unauthorized access to admin routes redirects to a known admin login URL. Additionally, the candidate application experience for logged-in users is functional but lacks "smart" guidance on missing information, requiring users to manually scan forms to see what's left to fill.

## What Changes

### 1. Admin Security & Isolation
- **Secure Redirects**: Accessing protected Admin routes (e.g., `/jobs`, `/dashboard`) without authentication will no longer redirect to `/admin/login`. Instead, it will redirect to a generic 404 Not Found page or the public Home page. This hides the existence of the admin panel and its login URL from casual probing.
- **Explicit Login**: The Admin Login page remains accessible only via direct URL entry (e.g., `/admin/login`).

### 2. Smart Candidate Application
- **Contextual Autofill**: When a logged-in candidate applies for a new job, the system will not only autofill their data but clearly visually distinguish between "Verified/Pre-filled" fields and "Missing/Required" fields.
- **Inline Completion**: A "What's Missing" summary or visual indicators will guide the user to complete specific missing fields (e.g., specific skills or updated contact info) without leaving the application context.

## Impact
- **Security**: Reduces the attack surface by hiding the admin login entry point from automatic redirects.
- **UX**: Increases conversion rates for applications by making it effortless for returning candidates to see exactly what new information is needed for a specific position.
