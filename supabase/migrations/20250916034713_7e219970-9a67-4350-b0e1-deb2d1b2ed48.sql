-- Create storage bucket for CV files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('cv-files', 'cv-files', false, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);

-- Create storage policies for CV files
CREATE POLICY "Admin can upload CV files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'cv-files' AND auth.jwt() ->> 'email' = 'admin@portfolio.com');

CREATE POLICY "Admin can view CV files"
ON storage.objects FOR SELECT
USING (bucket_id = 'cv-files' AND auth.jwt() ->> 'email' = 'admin@portfolio.com');

CREATE POLICY "Admin can update CV files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'cv-files' AND auth.jwt() ->> 'email' = 'admin@portfolio.com');

CREATE POLICY "Admin can delete CV files"
ON storage.objects FOR DELETE
USING (bucket_id = 'cv-files' AND auth.jwt() ->> 'email' = 'admin@portfolio.com');

-- Public access policy for CV downloads
CREATE POLICY "Anyone can download active CV"
ON storage.objects FOR SELECT
USING (bucket_id = 'cv-files' AND name = 'current-cv.pdf');

-- Create table for CV management
CREATE TABLE public.cv_management (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT false,
  version INTEGER DEFAULT 1,
  file_size BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on cv_management
ALTER TABLE public.cv_management ENABLE ROW LEVEL SECURITY;

-- CV management policies
CREATE POLICY "Admin can manage CV files"
ON public.cv_management FOR ALL
USING (auth.jwt() ->> 'email' = 'admin@portfolio.com');

CREATE POLICY "Anyone can view active CV info"
ON public.cv_management FOR SELECT
USING (is_active = true);

-- Create table for visitor analytics
CREATE TABLE public.visitor_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  page_views INTEGER DEFAULT 1,
  time_on_site INTERVAL,
  actions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on visitor_analytics
ALTER TABLE public.visitor_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can track analytics"
ON public.visitor_analytics FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admin can view analytics"
ON public.visitor_analytics FOR SELECT
USING (auth.jwt() ->> 'email' = 'admin@portfolio.com');

-- Create table for project interactions
CREATE TABLE public.project_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL,
  interaction_type TEXT NOT NULL, -- 'view', 'demo_click', 'github_click', 'like'
  visitor_session TEXT,
  ip_address INET,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on project_interactions
ALTER TABLE public.project_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can track project interactions"
ON public.project_interactions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view project interaction stats"
ON public.project_interactions FOR SELECT
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_cv_management_updated_at
  BEFORE UPDATE ON public.cv_management
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_visitor_analytics_updated_at
  BEFORE UPDATE ON public.visitor_analytics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();