-- Fix the search_path security issue for the function
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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;