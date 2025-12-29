-- Create storage bucket for CV documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cv-documents',
  'cv-documents',
  false, -- Private bucket for security
  10485760, -- 10MB limit
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
);

-- Storage policies for CV documents
CREATE POLICY "Admin can manage CV documents"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'cv-documents' AND
  (auth.jwt() ->> 'email'::text) = 'kutloano.moshao111@gmail.com'::text
);

CREATE POLICY "Admin can view CV documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'cv-documents' AND
  (auth.jwt() ->> 'email'::text) = 'kutloano.moshao111@gmail.com'::text
);