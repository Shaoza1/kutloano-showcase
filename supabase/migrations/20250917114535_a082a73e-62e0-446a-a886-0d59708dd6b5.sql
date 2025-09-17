-- Fix security issue: Remove public SELECT access from project_interactions table
-- This table contains sensitive visitor data (IP addresses, sessions) and should only be accessible to admins

DROP POLICY IF EXISTS "Anyone can view project interaction stats" ON public.project_interactions;

-- Create admin-only policy for project interactions
CREATE POLICY "Admin can view project interactions" 
ON public.project_interactions 
FOR SELECT 
USING ((auth.jwt() ->> 'email'::text) = 'admin@portfolio.com'::text);

-- Verify contact_submissions security is properly configured
-- The existing SELECT policy with 'false' is correct - it blocks all public access
-- Only admin users should be able to view contact submissions via the admin dashboard