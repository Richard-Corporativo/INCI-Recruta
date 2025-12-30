# PROPOSAL: User Creation Management

This proposal adds the ability to directly create users in the system, complementing the existing invitation workflow. While "inviting" a user typically involves a simulated email process, "creating" a user allows administrators to set up immediate access.

## User Value
- **Efficiency**: Administrators can quickly set up accounts for new team members without waiting for them to accept an invitation.
- **Control**: Immediate provisioning of access for critical roles.
- **Clarity**: Better separation between "onboarding via invite" and "direct account creation".

## Scope
- Update `Settings.tsx` to offer both "Invite User" and "Create User" options.
- Refactor `InviteUserModal.tsx` into a more versatile `UserModal.tsx` that supports both modes.
- Implement the UI flow for direct user creation (Name, Email, Password, Role, Department).
- Ensure new users are properly persisted in `localStorage`.

## Non-Goals
- Real email integration (still simulated).
- Bulk user import.
- Advanced permission toggles (keeping it to Roles for now).
