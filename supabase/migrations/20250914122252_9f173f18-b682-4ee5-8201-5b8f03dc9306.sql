-- Create contact form submissions table
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'new',
  responded_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting contact submissions (public access)
CREATE POLICY "Anyone can submit contact form" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (true);

-- Create policy for viewing submissions (admin only - for now just disable select)
CREATE POLICY "Only admin can view submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (false);

-- Create analytics table for tracking site interactions
CREATE TABLE public.site_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_data JSONB,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for analytics
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

-- Allow public analytics tracking
CREATE POLICY "Anyone can track analytics" 
ON public.site_analytics 
FOR INSERT 
WITH CHECK (true);

-- Create CV downloads tracking table
CREATE TABLE public.cv_downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  download_type TEXT NOT NULL DEFAULT 'pdf',
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for CV downloads
ALTER TABLE public.cv_downloads ENABLE ROW LEVEL SECURITY;

-- Allow public CV download tracking
CREATE POLICY "Anyone can track CV downloads" 
ON public.cv_downloads 
FOR INSERT 
WITH CHECK (true);