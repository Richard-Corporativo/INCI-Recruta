# Execution Plan Template

Use this template when planning implementation for an issue in Phase 3.

---

# EXECUTION PLAN — ISSUE-[number]

## 1. Internal research (within the project)

- [ ] Is there a reusable component? Which one?
- [ ] Is there a similar pattern already implemented? Where?
- [ ] Is there a type/interface I can reuse?
- [ ] Is there a util/helper that already does this?

## 2. External research (documentation)

- [ ] Official framework/library documentation
- [ ] Recommended pattern for this type of feature
- [ ] Reference implementation example
- [ ] Known gotchas/pitfalls

## 3. Technical decisions

- **Chosen approach:** [describe]
- **Discarded alternative:** [describe and why]
- **Accepted trade-offs:** [describe]

## 4. Implementation detail

For each file:

### File: `src/path/file.tsx`

- **Action:** create | modify | delete
- **What it does:** [description]
- **Exports:** [functions/components/types]
- **Imports from:** [dependencies]
- **Pattern to follow:** [reference to existing code]

## 5. Test scenarios

- [ ] Test: [happy path description]
- [ ] Test: [error scenario 1]
- [ ] Test: [error scenario 2]
- [ ] Test: [edge case]

---

## Planning Checklist

Before executing, verify:

1. All files from the issue are accounted for in section 4
2. Dependencies from previous issues are already implemented
3. No scope creep — only what the issue says
4. Test scenarios match the acceptance criteria
5. Existing code has been searched for reuse opportunities
