# Spec: Candidate Application

## MODIFIED Requirements

### Requirement: Application submission security
**Priority:** CRITICAL  
**Status:** MODIFIED

Candidate applications MUST be secured with appropriate RLS policies while allowing both authenticated and anonymous submissions.

#### Scenario: Authenticated user submits application
**Given** a user is logged in as a candidate  
**When** they submit a job application  
**Then** the system must insert the application with their `user_id`  
**And** the RLS policy must allow the INSERT operation  
**And** the application must be visible in their dashboard

#### Scenario: Anonymous user submits application
**Given** a user is not logged in  
**When** they submit a job application  
**Then** the system must insert the application without a `user_id`  
**And** the RLS policy must allow the INSERT operation  
**And** they must be redirected to create an account or login

#### Scenario: Duplicate application prevention
**Given** a user has already applied to a job  
**When** they attempt to apply again  
**Then** the system must detect the duplicate  
**And** show a warning message  
**And** prevent the duplicate submission

#### Scenario: Resume upload permissions
**Given** a candidate is submitting an application  
**When** they upload a PDF resume  
**Then** the storage policy must allow the upload  
**And** the file must be stored in the `resumes` bucket  
**And** a public URL must be generated and saved

---

### Requirement: Application data visibility
**Priority:** HIGH  
**Status:** MODIFIED

Candidates MUST only see their own applications, while admins can see all applications.

#### Scenario: Candidate views own applications
**Given** a candidate is logged in  
**When** they navigate to their dashboard  
**Then** they must see only applications where `user_id` matches their ID  
**And** they must not see other candidates' applications

#### Scenario: Admin views all applications
**Given** an admin user is logged in  
**When** they navigate to the candidates page  
**Then** they must see all applications regardless of `user_id`  
**And** they must be able to filter by job, status, or date

#### Scenario: Anonymous application tracking
**Given** a candidate applied without logging in  
**When** they later create an account with the same email  
**Then** the system should link their previous application  
**And** they should see it in their dashboard

---

## ADDED Requirements

### Requirement: RLS policy configuration
**Priority:** CRITICAL  
**Status:** ADDED

The `candidates` table MUST have properly configured Row Level Security policies.

#### Scenario: RLS is enabled
**Given** the database is deployed  
**When** querying the `candidates` table configuration  
**Then** RLS must be enabled  
**And** at least 4 policies must exist (insert auth, insert anon, select own, select admin)

#### Scenario: Insert policy for authenticated users
**Given** an authenticated user attempts to insert a candidate record  
**When** the `user_id` matches their auth.uid()  
**Then** the INSERT must succeed  
**When** the `user_id` does not match their auth.uid()  
**Then** the INSERT must be rejected

#### Scenario: Insert policy for anonymous users
**Given** an anonymous user attempts to insert a candidate record  
**When** they provide valid application data  
**Then** the INSERT must succeed  
**And** the `user_id` field must be NULL

#### Scenario: Select policy enforcement
**Given** a candidate is logged in  
**When** they query the `candidates` table  
**Then** they must only receive rows where `user_id` = auth.uid()  
**And** they must not receive any other rows

---

### Requirement: Storage bucket policies
**Priority:** CRITICAL  
**Status:** ADDED

The `resumes` storage bucket MUST allow public uploads and downloads.

#### Scenario: Resume upload allowed
**Given** a user is submitting an application  
**When** they upload a file to the `resumes` bucket  
**Then** the storage policy must allow the upload  
**And** the file must be accessible via public URL

#### Scenario: Resume download allowed
**Given** a resume has been uploaded  
**When** an admin or the candidate accesses the resume URL  
**Then** the file must be downloadable  
**And** the storage policy must allow the SELECT operation

#### Scenario: File type validation
**Given** a user is uploading a resume  
**When** they select a non-PDF file  
**Then** the frontend must reject the file  
**And** show an error message "Por favor, envie apenas arquivos PDF"

#### Scenario: File size validation
**Given** a user is uploading a resume  
**When** the file size exceeds 5MB  
**Then** the frontend must reject the file  
**And** show an error message "O arquivo deve ter no máximo 5MB"
