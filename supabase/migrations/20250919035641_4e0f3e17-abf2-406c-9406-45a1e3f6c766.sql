-- Create comprehensive portfolio management tables

-- Projects table for portfolio projects
CREATE TABLE public.portfolio_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  long_description TEXT,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  category TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'In Progress',
  year TEXT NOT NULL,
  duration TEXT,
  team_info TEXT,
  problem_statement TEXT,
  solution_overview TEXT,
  approach TEXT[],
  challenges JSONB DEFAULT '[]',
  key_features TEXT[],
  results JSONB,
  demo_video_url TEXT,
  live_demo_url TEXT,
  github_url TEXT,
  case_study_url TEXT,
  images TEXT[] DEFAULT '{}',
  architecture JSONB,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Skills table
CREATE TABLE public.portfolio_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  level INTEGER NOT NULL CHECK (level >= 0 AND level <= 100),
  category TEXT NOT NULL CHECK (category IN ('frontend', 'backend', 'ai', 'tools')),
  icon_name TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Certifications table
CREATE TABLE public.portfolio_certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  credential_id TEXT,
  credential_url TEXT,
  badge_image_url TEXT,
  description TEXT,
  skills_gained TEXT[],
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Education & Experience table
CREATE TABLE public.portfolio_experience (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('education', 'work', 'internship', 'volunteer')),
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  achievements TEXT[],
  technologies_used TEXT[],
  gpa DECIMAL(3,2),
  degree_type TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Blog/Articles table
CREATE TABLE public.portfolio_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT,
  excerpt TEXT,
  featured_image_url TEXT,
  article_url TEXT,
  pdf_url TEXT,
  category TEXT[],
  tags TEXT[],
  reading_time INTEGER,
  publication_date DATE,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Case studies table (detailed project documentation)
CREATE TABLE public.portfolio_case_studies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.portfolio_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  overview TEXT,
  methodology TEXT,
  detailed_process TEXT,
  lessons_learned TEXT,
  future_improvements TEXT,
  video_urls TEXT[],
  document_urls TEXT[],
  image_gallery TEXT[],
  interactive_demos TEXT[],
  technical_specs JSONB,
  performance_metrics JSONB,
  user_feedback JSONB,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_case_studies ENABLE ROW LEVEL SECURITY;

-- Create policies for public viewing
CREATE POLICY "Anyone can view active projects" ON public.portfolio_projects
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view active skills" ON public.portfolio_skills
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view active certifications" ON public.portfolio_certifications
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view active experience" ON public.portfolio_experience
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view published articles" ON public.portfolio_articles
  FOR SELECT USING (is_published = true);

CREATE POLICY "Anyone can view public case studies" ON public.portfolio_case_studies
  FOR SELECT USING (is_public = true);

-- Create admin policies for full CRUD access
CREATE POLICY "Admin can manage projects" ON public.portfolio_projects
  FOR ALL USING ((auth.jwt() ->> 'email'::text) = 'kutloano.moshao111@gmail.com'::text);

CREATE POLICY "Admin can manage skills" ON public.portfolio_skills
  FOR ALL USING ((auth.jwt() ->> 'email'::text) = 'kutloano.moshao111@gmail.com'::text);

CREATE POLICY "Admin can manage certifications" ON public.portfolio_certifications
  FOR ALL USING ((auth.jwt() ->> 'email'::text) = 'kutloano.moshao111@gmail.com'::text);

CREATE POLICY "Admin can manage experience" ON public.portfolio_experience
  FOR ALL USING ((auth.jwt() ->> 'email'::text) = 'kutloano.moshao111@gmail.com'::text);

CREATE POLICY "Admin can manage articles" ON public.portfolio_articles
  FOR ALL USING ((auth.jwt() ->> 'email'::text) = 'kutloano.moshao111@gmail.com'::text);

CREATE POLICY "Admin can manage case studies" ON public.portfolio_case_studies
  FOR ALL USING ((auth.jwt() ->> 'email'::text) = 'kutloano.moshao111@gmail.com'::text);

-- Create updated_at triggers
CREATE TRIGGER update_portfolio_projects_updated_at
  BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_skills_updated_at
  BEFORE UPDATE ON public.portfolio_skills
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_certifications_updated_at
  BEFORE UPDATE ON public.portfolio_certifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_experience_updated_at
  BEFORE UPDATE ON public.portfolio_experience
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_articles_updated_at
  BEFORE UPDATE ON public.portfolio_articles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_case_studies_updated_at
  BEFORE UPDATE ON public.portfolio_case_studies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_portfolio_projects_featured ON public.portfolio_projects(is_featured);
CREATE INDEX idx_portfolio_projects_status ON public.portfolio_projects(status);
CREATE INDEX idx_portfolio_skills_category ON public.portfolio_skills(category);
CREATE INDEX idx_portfolio_skills_active ON public.portfolio_skills(is_active);
CREATE INDEX idx_portfolio_certifications_active ON public.portfolio_certifications(is_active);
CREATE INDEX idx_portfolio_experience_type ON public.portfolio_experience(type);
CREATE INDEX idx_portfolio_articles_published ON public.portfolio_articles(is_published);
CREATE INDEX idx_portfolio_case_studies_public ON public.portfolio_case_studies(is_public);