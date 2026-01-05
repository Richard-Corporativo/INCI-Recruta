0# Supabase Configuration Guide

## ⚠️ IMPORTANT: Manual Configuration Required

To complete the implementation of "Disable Candidate Email Confirmation", you need to configure Supabase Dashboard settings.

## Steps to Disable Email Confirmation

### Option 1: Disable for All Users (Recommended for Development)

1. **Navigate to Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/uqvrzanthludtxwnmpan

2. **Access Authentication Settings**
   - Click on "Authentication" in the left sidebar
   - Click on "Providers"
   - Click on "Email"

3. **Disable Email Confirmation**
   - Find the "Confirm email" toggle
   - **Turn it OFF**
   - Click "Save"

### Option 2: Keep Email Confirmation for Admin Users (Production)

If you want to keep email confirmation for admin users but disable it for candidates, you'll need to:

1. **Keep "Confirm email" enabled in Supabase**
2. **Use a server-side hook to auto-confirm candidates**

Create a Supabase Edge Function or Database Function:

```sql
-- Auto-confirm candidates on signup
CREATE OR REPLACE FUNCTION public.auto_confirm_candidates()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user metadata has role = 'candidate'
  IF (NEW.raw_user_meta_data->>'role' = 'candidate') THEN
    -- Auto-confirm the email
    NEW.email_confirmed_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS auto_confirm_candidates_trigger ON auth.users;
CREATE TRIGGER auto_confirm_candidates_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_confirm_candidates();
```

## Verification

After configuration, test:

1. **Register a new candidate** at `/cadastro`
2. **Check that**:
   - User is automatically logged in
   - Redirected to `/candidate/dashboard`
   - No email confirmation required
   - No loading loops

## Current Status

✅ **Code Changes**: Complete
⏳ **Supabase Config**: Pending manual configuration

## Rollback

If you need to re-enable email confirmation:

1. Go to Supabase Dashboard → Authentication → Providers → Email
2. Turn ON "Confirm email"
3. Revert code changes in `App.tsx` and `CandidateRegister.tsx`
