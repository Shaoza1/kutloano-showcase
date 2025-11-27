-- Create portfolio_courses table for course work and lab reports
CREATE TABLE public.portfolio_courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  provider TEXT NOT NULL, -- e.g., 'WSO2', 'CISCO', 'Coursera'
  course_type TEXT, -- e.g., 'Certification', 'Lab', 'Project'
  completion_date DATE,
  duration TEXT,
  skills_learned TEXT[],
  document_url TEXT, -- Path to uploaded document in storage
  document_name TEXT, -- Original filename
  document_type TEXT, -- 'pdf', 'docx', 'pptx', etc.
  document_size BIGINT, -- File size in bytes
  cover_image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolio_courses ENABLE ROW LEVEL SECURITY;

-- Admin can manage courses
CREATE POLICY "Admin can manage courses"
ON public.portfolio_courses
FOR ALL
USING ((auth.jwt() ->> 'email'::text) = 'kutloano.moshao111@gmail.com'::text);

-- Anyone can view published courses
CREATE POLICY "Anyone can view published courses"
ON public.portfolio_courses
FOR SELECT
USING (is_published = true);

-- Create trigger for updated_at
CREATE TRIGGER update_portfolio_courses_updated_at
BEFORE UPDATE ON public.portfolio_courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for course documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-documents',
  'course-documents',
  true,
  52428800, -- 50MB limit
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/png',
    'image/jpeg',
    'image/jpg'
  ]
);

-- Storage policies for course documents
CREATE POLICY "Public can view course documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'course-documents');

CREATE POLICY "Admin can upload course documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'course-documents' AND
  (auth.jwt() ->> 'email'::text) = 'kutloano.moshao111@gmail.com'::text
);

CREATE POLICY "Admin can update course documents"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'course-documents' AND
  (auth.jwt() ->> 'email'::text) = 'kutloano.moshao111@gmail.com'::text
);

CREATE POLICY "Admin can delete course documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'course-documents' AND
  (auth.jwt() ->> 'email'::text) = 'kutloano.moshao111@gmail.com'::text
);