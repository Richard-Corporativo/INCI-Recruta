# Global Rules

Complete list of rules for the Balha Framework.

---

## What to ALWAYS do

1. **Spec first** — Write the complete spec before any code
2. **Small issues** — Break into issues of max 5-7 files each
3. **Negative scope** — Explicitly state what NOT to do in each issue
4. **Search first** — Look at existing code before creating anything new
5. **Exact paths** — List every file with its full path
6. **One issue = one PR** — Each issue gets its own branch and pull request
7. **Test before moving on** — Verify each issue works before starting the next
8. **Server-side logic** — Keep all business logic on the server
9. **Reusable components** — Use existing components instead of creating duplicates
10. **Commit per issue** — Make a commit at the end of each completed issue

---

## What to NEVER do

1. **No code without spec** — Never start coding before the spec is approved
2. **No "build everything"** — Never ask for the entire app at once
3. **No autonomous architecture** — Don't let the AI decide architecture alone
4. **No skipped errors** — Never skip error scenarios in specs or flows
5. **No frontend keys** — Never put API keys in the frontend
6. **No duplicates** — Never create a component that already exists
7. **No skipped tests** — Never skip writing tests
8. **No dependency jumping** — Never start an issue before its dependencies are done
9. **No unreviewed code** — Never accept generated code without reviewing it
10. **No refactoring + feature** — Never refactor alongside a new feature (separate issues)

---

## Naming Conventions

Adapt these to the project's existing patterns. If the project has no conventions yet, propose these:

- **Files:** kebab-case for pages (`user-profile.tsx`), PascalCase for components (`UserProfile.tsx`)
- **Components:** PascalCase (`UserProfile`)
- **Functions/variables:** camelCase (`getUserData`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **Database tables:** snake_case (`user_profiles`)
- **Database columns:** snake_case (`created_at`)
- **API routes:** kebab-case (`/api/user-profiles`)

---

## Error Handling Pattern

All server functions should follow this return pattern:

```typescript
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } }
```

Never throw generic errors. Always return typed results.

---

## State Management

Components should handle these four states:

1. **Loading** — Show skeleton/spinner
2. **Empty** — Show empty state message with action
3. **Error** — Show error message with retry option
4. **Success** — Show the actual content

---

## Security Checklist

- [ ] API keys only in environment variables
- [ ] RLS policies defined for all tables
- [ ] Input validation on all server actions
- [ ] Authentication checked on protected routes
- [ ] Authorization checked for role-based access
- [ ] No sensitive data in error messages
- [ ] No internal IDs exposed to frontend
- [ ] Rate limiting on public endpoints
- [ ] CORS configured correctly
- [ ] SQL injection prevented (use parameterized queries)
