# Design: Candidate Auth & UX Refinement

## Problem Statement
The current candidate registration flow is fragile and provides poor feedback. 
1. **RLS & Registration**: The client-side logic attempts to insert into `public.users` and `public.candidates` immediately after `signUp`. If email confirmation is required, the user might not be in a session yet, leading to RLS failures. Even if successful, it's a multi-step process that can fail halfway.
2. **User Feedback**: Native browser alerts are used, which feels non-premium and intrusive.
3. **Verification awareness**: Users are not clearly informed that they need to verify their email.
4. **Enforcement**: Users can access the dashboard while unverified but cannot perform operations, leading to confusion.

## Proposed Solution

### 1. Robust User Provisioning (DB Trigger)
We will move the creation of entries in `public.users` and `public.candidates` to a PostgreSQL trigger on `auth.users`. 
- **Benefit**: Guaranteed creation of profiles regardless of client-side errors.
- **Implementation**: A SQL migration to create the trigger function.

### 2. Custom Notification System (Toasts)
Implement a modern, non-blocking toast notification system.
- **Component**: `Toast.tsx` using Tailwind for styling.
- **Provider**: `ToastContext` to allow calling `toast.success()`, `toast.error()` from anywhere.

### 3. Verification Flow
- **CandidateRegister**: Instead of navigating to `/candidate/dashboard` immediately, it will show a "Check your email" success state.
- **Auth Guard**: Update `RequireCandidateAuth` to detect if a user's email is unverified.
- **Verification Screen**: A dedicated state/page for unverified users asking them to check their inbox and providing a "Resend Link" button.

### 4. Premium Loading & Data Treatment
- **Skeletons**: Implement `Skeleton` components for the dashboard and applications list.
- **Transitions**: Ensure all data-driven components have a smooth fade-in after loading.

## Technical Details

### SQL Trigger
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into public.users
  INSERT INTO public.users (id, name, email, role, status)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.email, 'candidate', 'active');

  -- Insert into public.candidates
  INSERT INTO public.candidates (user_id, name, email, column_id)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.email, 'received');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Toast API
- `useToast()` hook.
- `showToast(message, type: 'success' | 'error' | 'info')`.
