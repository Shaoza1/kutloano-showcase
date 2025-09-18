-- Fix all remaining security issues by adding proper SELECT restrictions

-- 1. Add an explicit deny policy for contact_submissions for non-admin users
CREATE POLICY "Deny public access to contact submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (false);

-- 2. Add SELECT restriction for visitor_analytics (admin only)
CREATE POLICY "Admin can view visitor analytics" 
ON public.visitor_analytics 
FOR SELECT 
USING ((auth.jwt() ->> 'email'::text) = 'admin@portfolio.com'::text);

-- 3. Add SELECT restriction for site_analytics (admin only)  
CREATE POLICY "Admin can view site analytics" 
ON public.site_analytics 
FOR SELECT 
USING ((auth.jwt() ->> 'email'::text) = 'admin@portfolio.com'::text);