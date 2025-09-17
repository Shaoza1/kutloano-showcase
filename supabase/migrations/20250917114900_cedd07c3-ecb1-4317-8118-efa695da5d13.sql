-- Fix remaining security issues

-- 1. Fix contact_submissions table to allow admin access
DROP POLICY IF EXISTS "Only admin can view submissions" ON public.contact_submissions;

CREATE POLICY "Admin can view contact submissions" 
ON public.contact_submissions 
FOR SELECT 
USING ((auth.jwt() ->> 'email'::text) = 'admin@portfolio.com'::text);

-- 2. Fix cv_management table to limit exposed fields for public access
DROP POLICY IF EXISTS "Anyone can view active CV info" ON public.cv_management;

-- Create a more restrictive policy that only exposes necessary fields to public
-- This requires using a function since RLS policies can't directly filter columns
CREATE OR REPLACE FUNCTION public.get_active_cv_info()
RETURNS TABLE(
  filename TEXT,
  version INTEGER,
  upload_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT cm.filename, cm.version, cm.upload_date
  FROM public.cv_management cm
  WHERE cm.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;