-- Migration: 004_fix_candidate_resume_rls.sql
-- Description: Fix RLS policies to allow candidates to manage their own resumes
-- Author: OpenSpec Migration
-- Date: 2026-01-09

-- ============================================================================
-- Fix RLS Policies for candidate_resumes
-- ============================================================================

-- 1. Candidates can insert own resume
DROP POLICY IF EXISTS "Candidates can insert own resume" ON candidate_resumes;
CREATE POLICY "Candidates can insert own resume"
    ON candidate_resumes
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM candidates
            WHERE candidates.id = candidate_resumes.candidate_id
            AND candidates.user_id = auth.uid()
        )
    );

-- 2. Candidates can update own resume
DROP POLICY IF EXISTS "Candidates can update own resume" ON candidate_resumes;
CREATE POLICY "Candidates can update own resume"
    ON candidate_resumes
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM candidates
            WHERE candidates.id = candidate_resumes.candidate_id
            AND candidates.user_id = auth.uid()
        )
    );

-- 3. Candidates can delete own resume
DROP POLICY IF EXISTS "Candidates can delete own resume" ON candidate_resumes;
CREATE POLICY "Candidates can delete own resume"
    ON candidate_resumes
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM candidates
            WHERE candidates.id = candidate_resumes.candidate_id
            AND candidates.user_id = auth.uid()
        )
    );
