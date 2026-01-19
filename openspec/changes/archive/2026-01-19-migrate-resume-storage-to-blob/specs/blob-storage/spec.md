# Spec: BLOB Storage for Resume Files

## Capability
`blob-storage`

## Overview
Enable in-database binary storage for candidate resume PDFs using PostgreSQL `bytea` type, replacing external Supabase Storage dependency.

---

## ADDED Requirements

### Requirement: Database Schema for Binary Storage
**ID**: `BLOB-001`  
**Priority**: P0

The system SHALL create a dedicated table `candidate_resumes` to store PDF binary data with the following structure:
- Primary key: UUID
- Foreign key to `candidates.id` with CASCADE delete
- BYTEA column for binary file data
- Metadata columns: file_name, mime_type, file_size
- Timestamps: created_at, updated_at
- UNIQUE constraint on `candidate_id` (1:1 relationship)

#### Scenario: Create Resume Table
**Given** the database migration is executed  
**When** the `candidate_resumes` table is created  
**Then** the table SHALL have all required columns  
**And** the foreign key constraint SHALL enforce CASCADE delete  
**And** the UNIQUE constraint SHALL prevent duplicate resumes per candidate

#### Scenario: Enforce Data Integrity
**Given** a candidate record exists with ID `abc-123`  
**When** a resume is inserted with `candidate_id = 'abc-123'`  
**And** another resume is inserted with the same `candidate_id`  
**Then** the second insert SHALL fail with UNIQUE constraint violation

#### Scenario: Cascade Delete
**Given** a candidate with ID `abc-123` has a resume  
**When** the candidate record is deleted  
**Then** the associated resume SHALL be automatically deleted

---

### Requirement: Row Level Security for Resume Access
**ID**: `BLOB-002`  
**Priority**: P0

The system SHALL implement RLS policies on `candidate_resumes` to ensure:
- Admin/Recruiter roles can view/manage all resumes
- Candidates can only view their own resume
- Unauthenticated users have no access

#### Scenario: Admin Access to All Resumes
**Given** a user with role `admin` is authenticated  
**When** they query `candidate_resumes` table  
**Then** they SHALL see all resume records

#### Scenario: Candidate Access to Own Resume Only
**Given** a candidate user is authenticated with `user_id = 'xyz-789'`  
**And** their candidate record has `id = 'abc-123'`  
**When** they query `candidate_resumes` WHERE `candidate_id = 'abc-123'`  
**Then** they SHALL see their resume  
**When** they query for a different `candidate_id`  
**Then** they SHALL see zero results

#### Scenario: Unauthenticated Access Denied
**Given** no user is authenticated  
**When** any query is made to `candidate_resumes`  
**Then** the query SHALL return zero results

---

### Requirement: Automatic Resume Flag Maintenance
**ID**: `BLOB-003`  
**Priority**: P0

The system SHALL maintain a `has_resume` boolean flag on the `candidates` table that automatically updates when resumes are added or removed.

#### Scenario: Flag Set on Resume Upload
**Given** a candidate with `id = 'abc-123'` has `has_resume = FALSE`  
**When** a resume is inserted into `candidate_resumes` with `candidate_id = 'abc-123'`  
**Then** the `candidates.has_resume` flag SHALL be set to TRUE

#### Scenario: Flag Cleared on Resume Delete
**Given** a candidate with `id = 'abc-123'` has `has_resume = TRUE`  
**When** the resume is deleted from `candidate_resumes`  
**Then** the `candidates.has_resume` flag SHALL be set to FALSE

---

### Requirement: Binary File Upload
**ID**: `BLOB-004`  
**Priority**: P0

The system SHALL accept PDF file uploads and store them as binary data in the database with validation.

#### Scenario: Upload Valid PDF
**Given** a user selects a PDF file of 2MB  
**When** they submit the upload form  
**Then** the file SHALL be converted to Uint8Array  
**And** inserted into `candidate_resumes.file_data`  
**And** metadata (name, size, mime_type) SHALL be stored

#### Scenario: Reject Oversized File
**Given** a user selects a PDF file of 6MB  
**When** they attempt to upload  
**Then** the system SHALL reject the upload  
**And** display error message "Resume must be smaller than 5MB"

#### Scenario: Reject Non-PDF File
**Given** a user selects a .docx file  
**When** they attempt to upload  
**Then** the system SHALL reject the upload  
**And** display error message "Only PDF files are allowed"

#### Scenario: Prevent Duplicate Resume
**Given** a candidate already has a resume  
**When** they attempt to upload another resume  
**Then** the system SHALL either:
- Replace the existing resume (UPDATE), OR
- Reject with error "Resume already exists"

---

### Requirement: Binary File Download
**ID**: `BLOB-005`  
**Priority**: P0

The system SHALL allow authorized users to download resumes as PDF files.

#### Scenario: Download Existing Resume
**Given** a candidate has a resume stored in the database  
**When** an authorized user clicks "Download Resume"  
**Then** the system SHALL fetch the binary data  
**And** convert it to a Blob object  
**And** trigger browser download with original filename

#### Scenario: Handle Missing Resume
**Given** a candidate does NOT have a resume  
**When** a user attempts to download  
**Then** the system SHALL return null or error  
**And** display message "No resume available"

#### Scenario: Resume Opens in Browser
**Given** a resume is downloaded  
**When** the user opens the downloaded file  
**Then** it SHALL be a valid PDF viewable in PDF readers

---

### Requirement: Performance Optimization for Listings
**ID**: `BLOB-006`  
**Priority**: P0

The system SHALL ensure candidate listing queries do NOT fetch binary resume data to maintain performance.

#### Scenario: Kanban Query Excludes BLOB Data
**Given** the Kanban board is loading candidates  
**When** the query is executed  
**Then** it SHALL SELECT only: `id, name, email, has_resume`  
**And** it SHALL NOT join or select from `candidate_resumes` table

#### Scenario: Kanban Load Time Under 500ms
**Given** a job has 100 candidates  
**When** the Kanban board loads  
**Then** the query SHALL complete in less than 500ms  
**And** no BLOB data SHALL be transferred

#### Scenario: Resume Data Loaded On-Demand
**Given** a user views a candidate card  
**When** they click "View Resume"  
**Then** and ONLY then SHALL the system fetch binary data  
**And** the fetch SHALL be a separate query targeting `candidate_resumes`

---

### Requirement: Atomic Candidate Creation with Resume
**ID**: `BLOB-007`  
**Priority**: P0

The system SHALL support creating a candidate and uploading their resume in a single atomic transaction.

#### Scenario: Successful Candidate + Resume Creation
**Given** a user submits a job application with resume  
**When** the form is processed  
**Then** the system SHALL:
1. Insert candidate record into `candidates`
2. Insert resume binary into `candidate_resumes`
3. Commit both inserts as a single transaction

#### Scenario: Resume Upload Fails - Rollback Candidate
**Given** a user submits a job application with resume  
**When** the candidate insert succeeds  
**But** the resume insert fails (e.g., size limit)  
**Then** the system SHALL rollback the candidate insert  
**And** display error message to user

---

## MODIFIED Requirements

### Requirement: Remove External Storage Dependency
**ID**: `BLOB-008`  
**Priority**: P0

The system SHALL remove all references to Supabase Storage buckets for resume files.

**Previous Behavior**:
- Resumes uploaded to `resumes` bucket
- `candidates.resume_url` stored public URL
- `CandidateService.uploadResume()` returned URL string

**New Behavior**:
- Resumes stored in `candidate_resumes` table
- `candidates.resume_url` column removed
- `CandidateService.uploadResume()` returns boolean success

#### Scenario: No Storage Bucket Calls
**Given** the new code is deployed  
**When** any resume operation is performed  
**Then** zero calls SHALL be made to `supabase.storage`  
**And** all operations SHALL use `supabase.from('candidate_resumes')`

#### Scenario: Resume URL Column Removed
**Given** the database migration is complete  
**When** querying the `candidates` table schema  
**Then** the `resume_url` column SHALL NOT exist

---

### Requirement: Update CandidateService API
**ID**: `BLOB-009`  
**Priority**: P0

The `CandidateService` SHALL be updated with new method signatures for BLOB-based storage.

**Previous API**:
```typescript
uploadResume(file: File, email: string): Promise<string>  // Returns URL
addCandidate(candidate): Promise<Candidate>
```

**New API**:
```typescript
uploadResume(file: File, candidateId: string): Promise<boolean>
downloadResume(candidateId: string): Promise<{ blob: Blob; fileName: string } | null>
hasResume(candidateId: string): Promise<boolean>
deleteResume(candidateId: string): Promise<boolean>
addCandidate(candidate, resumeFile?: File): Promise<Candidate | null>
```

#### Scenario: Upload Returns Boolean
**Given** a resume upload is initiated  
**When** the upload succeeds  
**Then** `uploadResume()` SHALL return `true`  
**When** the upload fails  
**Then** `uploadResume()` SHALL return `false` or throw error

#### Scenario: Download Returns Blob
**Given** a resume exists for candidate `abc-123`  
**When** `downloadResume('abc-123')` is called  
**Then** it SHALL return `{ blob: Blob, fileName: 'resume.pdf' }`

---

## REMOVED Requirements

### Requirement: Storage Bucket Configuration
**ID**: `BLOB-010`  
**Priority**: P0

The following requirement is REMOVED:

~~The system SHALL configure a Supabase Storage bucket named `resumes` with public access policies.~~

**Rationale**: No longer using external storage.

#### Scenario: No Bucket Creation Needed
**Given** a new INCIRECRUTA instance is deployed  
**When** the system is initialized  
**Then** no Storage bucket SHALL be created  
**And** the system SHALL function without Storage configuration

---

## Non-Functional Requirements

### Performance
- Kanban listing queries: < 500ms for 100 candidates
- Resume download: < 2s for 5MB file
- Database growth: ~3-5MB per candidate (with resume)

### Security
- RLS policies enforced on all resume access
- File type validation (PDF only)
- File size validation (max 5MB)
- No direct BLOB data exposure in listings

### Scalability
- Support up to 10,000 candidates with resumes
- Database size monitoring and alerts
- Potential for future compression/optimization

---

## Acceptance Criteria

✅ All database migrations execute successfully  
✅ RLS policies prevent unauthorized access  
✅ Resume upload/download works end-to-end  
✅ Kanban performance unchanged (< 500ms)  
✅ No references to Supabase Storage in codebase  
✅ All tests pass (manual + automated)  
✅ Documentation updated  

---

**Spec Status**: ✅ Complete  
**Related Specs**: None  
**Dependencies**: PostgreSQL with bytea support, Supabase client library
