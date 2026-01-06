## 1. Admin Security
- [x] 1.1 **Route Protection**: Update `RequireAuth` to redirect unauthenticated requests to `/` (Home) or `/404` instead of `/admin/login`. <!-- uuid: route-protection -->
- [x] 1.2 **Login Isolation**: Ensure `/admin/login` is the only entry point for admin authentication and is not linked from public pages. <!-- uuid: login-protection -->

## 2. Smart Application Flow
- [x] 2.1 **Gap Analysis**: Update `JobApplication` to calculate missing fields based on the candidate's profile vs. form requirements keying off `user_id`. <!-- uuid: gap-analysis -->
- [x] 2.2 **Visual Indicators**: Add "Pre-filled" visual cues (e.g., checks or distinctive background) to autofilled inputs. <!-- uuid: autofill-ui -->
- [x] 2.3 **Completion Prompt**: Add a dismissible "Missing Info" summary at the top of the form if fields are empty, with anchor links to those fields. <!-- uuid: completion-prompt -->
