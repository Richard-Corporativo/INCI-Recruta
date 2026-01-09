# Proposal: Migrate Resume Storage to In-Database BLOB

## Change ID
`migrate-resume-storage-to-blob`

## Overview
Replace the current external storage model (Supabase Storage buckets) with in-database binary storage (PostgreSQL `bytea`) for PDF resumes. This change eliminates dependency on external storage services and centralizes all data within the PostgreSQL database.

## Problem Statement
The current implementation uses Supabase Storage buckets to store resume PDFs, creating:
- **External dependency** on storage service availability
- **URL-based references** that can break if storage configuration changes
- **Split architecture** between database (metadata) and storage (files)
- **Complexity** in backup/restore operations (two separate systems)

## Proposed Solution
Implement a **satellite table architecture** to store PDF binary data directly in PostgreSQL while maintaining Kanban performance:

1. **New Table**: `candidate_resumes` - Dedicated table for BLOB storage
2. **Modified Table**: `candidates` - Remove `resume_url`, add optional `has_resume` flag
3. **Service Layer**: Update `CandidateService` to handle binary data
4. **Frontend**: Convert File objects to binary format for database storage

### Why Satellite Table?
Storing BLOBs in the main `candidates` table would severely impact Kanban performance. Every candidate list query would load heavy binary data unnecessarily. The satellite table ensures:
- **Fast listings**: Kanban queries only touch lightweight metadata
- **On-demand loading**: Binary data fetched only when user clicks "View Resume"
- **Scalability**: Database can optimize BLOB storage separately

## Benefits
✅ **Single Source of Truth**: All data in PostgreSQL  
✅ **Simplified Backup**: One database backup includes everything  
✅ **No External Dependencies**: No storage bucket configuration needed  
✅ **Atomic Transactions**: Resume upload/delete happens in same transaction as candidate data  
✅ **Performance Preserved**: Satellite table keeps Kanban fast  

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Database size growth | Medium | Enforce 5MB limit per PDF, monitor storage |
| Query performance degradation | High | **Use satellite table**, never SELECT file_data in listings |
| Network transfer overhead | Medium | Implement lazy loading, only fetch when needed |
| Backup time increase | Low | PostgreSQL handles BLOB backups efficiently |

## Scope
This change affects:
- **Database Schema**: New table, modified columns
- **Backend Services**: `CandidateService` methods
- **Frontend Components**: File upload/download logic
- **Type Definitions**: TypeScript interfaces

## Out of Scope
- Migration of existing resumes from Storage to database (manual process)
- Support for file types other than PDF
- Resume preview/rendering features
- Compression or optimization of PDF files

## Success Criteria
1. ✅ Resumes stored as binary data in `candidate_resumes` table
2. ✅ No references to Supabase Storage in codebase
3. ✅ Kanban performance unchanged (< 500ms load time)
4. ✅ Resume download/view functionality working
5. ✅ File size validation enforced (max 5MB)

## Dependencies
- PostgreSQL database with `bytea` support (already available)
- Supabase client library (already installed)
- No new external dependencies required

## Timeline Estimate
- **Design & Spec**: 1 day (this document)
- **Database Migration**: 2 hours
- **Service Layer Updates**: 4 hours
- **Frontend Updates**: 4 hours
- **Testing & Validation**: 2 hours
- **Total**: ~2 days

## Approval Required
This is a **breaking architectural change** that requires:
- [ ] Database schema review
- [ ] Performance impact assessment
- [ ] Backup strategy confirmation
- [ ] Stakeholder approval

---

**Next Steps**: Review this proposal, then proceed to `tasks.md` and `design.md` for implementation details.
