# Spec Template

Use this template when generating a project specification in Phase 1.

---

# SPEC: [Project Name]

Date: [date]
Version: [1.0]

---

## 1. OVERVIEW

### 1.1 What it is
[2-3 sentences describing what the project does]

### 1.2 Problem it solves
[What user pain point is being addressed]

### 1.3 Target audience
[Who will use this]

### 1.4 Technical stack
- Frontend: [e.g., Next.js 14, React, Tailwind, shadcn/ui]
- Backend: [e.g., Next.js API Routes / Server Actions]
- Database: [e.g., Supabase / PostgreSQL]
- Auth: [e.g., Supabase Auth / Clerk]
- Payments: [e.g., Stripe]
- Deploy: [e.g., Vercel]
- Other: [e.g., Resend for emails, S3 for uploads]

### 1.5 Architecture rules
- All business logic MUST live on the server (Server Actions / API Routes)
- API keys NEVER in the frontend
- Components must be reusable
- One component = one responsibility
- Naming convention: [define standard]

---

## 2. PAGES

### Page: [Page Name]

- **Route:** `/path`
- **Access:** public | authenticated | admin
- **Description:** What the user sees and does here
- **Components used:**
  - ComponentA
  - ComponentB
- **Page states:**
  - Loading: [what appears]
  - Empty: [what appears when no data]
  - Error: [what appears on failure]
  - Success: [default state with data]

*(Repeat for each page)*

---

## 3. COMPONENTS

### Component: [ComponentName]

- **Type:** pure UI | with logic | layout
- **Props:**
  - `prop1`: type - description
  - `prop2`: type - description
- **Variants:** [if any]
- **Used in:** Page X, Page Y
- **Dependencies:** [other components it uses]

*(Repeat for each component)*

---

## 4. BEHAVIORS (User Flows)

### Flow: [Flow Name]

- **Trigger:** What the user does to start
- **Happy path:**
  1. User does X
  2. System processes Y
  3. User sees Z
- **Error scenarios:**
  - If [condition]: show [message/action]
  - If [condition]: redirect to [page]
- **Validations:**
  - Field X: [rules]
  - Field Y: [rules]
- **Side effects:**
  - Send email? [yes/no]
  - Update other data? [yes/no]
  - Webhook? [yes/no]

*(Repeat for each flow)*

---

## 5. DATA MODEL

### Table: [table_name]

| Column     | Type      | Required | Description       |
| ---------- | --------- | -------- | ----------------- |
| id         | uuid      | yes      | Primary key       |
| created_at | timestamp | yes      | Creation date     |
| ...        | ...       | ...      | ...               |

### Relationships:
- table_a.field → table_b.field (type: 1:N / N:N / 1:1)

### RLS (Row Level Security):
- SELECT: [who can read]
- INSERT: [who can create]
- UPDATE: [who can edit]
- DELETE: [who can delete]
