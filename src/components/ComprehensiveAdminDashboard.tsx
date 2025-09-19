"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Upload,
  Download,
  Eye,
  Users,
  FileText,
  Mail,
  TrendingUp,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  Activity,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Code,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Video,
  Github,
  ExternalLink
} from "lucide-react";
import { supabase, SUPABASE_URL } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Interface definitions
interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  long_description?: string;
  technologies: string[];
  category: string[];
  status: string;
  year: string;
  duration?: string;
  team_info?: string;
  problem_statement?: string;
  solution_overview?: string;
  approach?: string[];
  challenges?: any[];
  key_features?: string[];
  results?: any;
  demo_video_url?: string;
  live_demo_url?: string;
  github_url?: string;
  case_study_url?: string;
  images?: string[];
  architecture?: any;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface Skill {
  id: string;
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'ai' | 'tools';
  icon_name?: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
  badge_image_url?: string;
  description?: string;
  skills_gained?: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface Experience {
  id: string;
  type: 'education' | 'work' | 'internship' | 'volunteer';
  title: string;
  organization: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  achievements?: string[];
  technologies_used?: string[];
  gpa?: number;
  degree_type?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Article {
  id: string;
  title: string;
  subtitle?: string;
  content?: string;
  excerpt?: string;
  featured_image_url?: string;
  article_url?: string;
  pdf_url?: string;
  category?: string[];
  tags?: string[];
  reading_time?: number;
  publication_date?: string;
  is_published: boolean;
  is_featured: boolean;
  view_count: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface CVFile {
  id: string;
  filename: string;
  file_path: string;
  upload_date: string;
  is_active: boolean;
  version: number;
  file_size: number;
}

interface ContactSubmission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  responded_at: string | null;
}

interface AnalyticsData {
  summary: {
    totalPageViews: number;
    totalContacts: number;
    totalCVDownloads: number;
    totalProjectInteractions: number;
    uniqueVisitors: number;
  };
  projectInteractions: Record<string, {
    views: number;
    demoClicks: number;
    githubClicks: number;
    likes: number;
  }>;
  visitors: Array<{
    country: string;
    city: string;
    deviceType: string;
    browser: string;
    os: string;
    pageViews: number;
    timeOnSite: string;
    timestamp: string;
  }>;
  timeframe: string;
}

export default function ComprehensiveAdminDashboard() {
  // State for all data
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [cvFiles, setCvFiles] = useState<CVFile[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  
  // UI state
  const [uploading, setUploading] = useState(false);
  const [timeframe, setTimeframe] = useState('7d');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authKey, setAuthKey] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<string>('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createType, setCreateType] = useState<string>('');
  
  const { toast } = useToast();
  const ADMIN_KEY = 'kutloano_admin_2024';

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
      fetchAnalytics(timeframe);
    }
  }, [isAuthenticated, timeframe]);

  const handleAuth = () => {
    if (authKey === ADMIN_KEY) {
      setIsAuthenticated(true);
      toast({
        title: "Authentication successful",
        description: "Welcome to your comprehensive admin dashboard!",
      });
    } else {
      toast({
        title: "Authentication failed",
        description: "Invalid admin key",
        variant: "destructive",
      });
    }
  };

  const fetchAllData = async () => {
    try {
      const [
        projectsRes,
        skillsRes,
        certificationsRes,
        experiencesRes,
        articlesRes,
        cvRes,
        contactRes
      ] = await Promise.all([
        supabase.from('portfolio_projects').select('*').order('sort_order', { ascending: false }),
        supabase.from('portfolio_skills').select('*').order('category, sort_order'),
        supabase.from('portfolio_certifications').select('*').order('issue_date', { ascending: false }),
        supabase.from('portfolio_experience').select('*').order('start_date', { ascending: false }),
        supabase.from('portfolio_articles').select('*').order('created_at', { ascending: false }),
        supabase.from('cv_management').select('*').order('created_at', { ascending: false }),
        supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
      ]);

      if (projectsRes.data) setProjects(projectsRes.data as any);
      if (skillsRes.data) setSkills(skillsRes.data as any);
      if (certificationsRes.data) setCertifications(certificationsRes.data as any);
      if (experiencesRes.data) setExperiences(experiencesRes.data as any);
      if (articlesRes.data) setArticles(articlesRes.data as any);
      if (cvRes.data) setCvFiles(cvRes.data);
      if (contactRes.data) setContactSubmissions(contactRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive",
      });
    }
  };

  const fetchAnalytics = async (period: string) => {
    try {
      const response = await supabase.functions.invoke('analytics-dashboard', {
        body: { timeframe: period }
      });
      if (response.data) setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  // CRUD Operations
  const createItem = async (type: string, data: any) => {
    try {
      const tableName = getTableName(type);
      const { error } = await supabase.from(tableName).insert([data]);
      
      if (error) throw error;
      
      await fetchAllData();
      setShowCreateDialog(false);
      toast({
        title: "Success",
        description: `${type} created successfully!`,
      });
    } catch (error) {
      console.error('Error creating item:', error);
      toast({
        title: "Error",
        description: `Failed to create ${type}`,
        variant: "destructive",
      });
    }
  };

  const updateItem = async (type: string, id: string, data: any) => {
    try {
      const tableName = getTableName(type);
      const { error } = await supabase.from(tableName).update(data).eq('id', id);
      
      if (error) throw error;
      
      await fetchAllData();
      setEditingItem(null);
      setEditingType('');
      toast({
        title: "Success",
        description: `${type} updated successfully!`,
      });
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: `Failed to update ${type}`,
        variant: "destructive",
      });
    }
  };

  const deleteItem = async (type: string, id: string) => {
    try {
      const tableName = getTableName(type);
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      
      if (error) throw error;
      
      await fetchAllData();
      toast({
        title: "Success",
        description: `${type} deleted successfully!`,
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: `Failed to delete ${type}`,
        variant: "destructive",
      });
    }
  };

  const getTableName = (type: string): any => {
    const mapping: Record<string, any> = {
      'project': 'portfolio_projects',
      'skill': 'portfolio_skills', 
      'certification': 'portfolio_certifications',
      'experience': 'portfolio_experience',
      'article': 'portfolio_articles'
    };
    return mapping[type] || type;
  };

  // CV Management (existing functionality)
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('makeActive', 'true');

      const res = await fetch(`${SUPABASE_URL}/functions/v1/cv-upload`, {
        method: 'POST',
        headers: {
          'x-admin-key': ADMIN_KEY,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to upload CV');

      await fetchAllData();
      toast({
        title: "Success",
        description: "CV uploaded successfully!",
      });
    } catch (error) {
      console.error('Error uploading CV:', error);
      toast({
        title: "Error",
        description: "Failed to upload CV",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const setActiveCV = async (cvId: string) => {
    try {
      await supabase.from('cv_management').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000');
      const { error } = await supabase.from('cv_management').update({ is_active: true }).eq('id', cvId);
      
      if (error) throw error;
      
      await fetchAllData();
      toast({
        title: "Success",
        description: "Active CV updated successfully!",
      });
    } catch (error) {
      console.error('Error setting active CV:', error);
      toast({
        title: "Error",
        description: "Failed to update active CV",
        variant: "destructive",
      });
    }
  };

  const markAsResponded = async (submissionId: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ 
          status: 'responded',
          responded_at: new Date().toISOString()
        })
        .eq('id', submissionId);

      if (error) throw error;
      
      await fetchAllData();
      toast({
        title: "Success",
        description: "Marked as responded successfully!",
      });
    } catch (error) {
      console.error('Error updating contact submission:', error);
      toast({
        title: "Error",
        description: "Failed to update contact submission",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Portfolio Admin Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Enter admin key"
              value={authKey}
              onChange={(e) => setAuthKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
            />
            <Button onClick={handleAuth} className="w-full">
              Access Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Comprehensive Portfolio Admin Dashboard</h1>
          <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
            Logout
          </Button>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="cv-management">CV Management</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
          </TabsList>

          {/* Analytics Tab - Keep existing analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex gap-4 items-center">
              <h2 className="text-xl font-semibold">Analytics Overview</h2>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {analytics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.summary.totalPageViews}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.summary.uniqueVisitors}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">CV Downloads</CardTitle>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.summary.totalCVDownloads}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Contact Forms</CardTitle>
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.summary.totalContacts}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Project Interactions</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.summary.totalProjectInteractions}</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Projects Management</h2>
              <Button onClick={() => { setCreateType('project'); setShowCreateDialog(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>
            
            <div className="grid gap-4">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium">{project.title}</h3>
                          {project.is_featured && <Badge>Featured</Badge>}
                          <Badge variant="outline">{project.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                        <div className="flex gap-2 flex-wrap">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} variant="secondary">{tech}</Badge>
                          ))}
                        </div>
                        <div className="flex gap-4 text-sm">
                          {project.demo_video_url && (
                            <a href={project.demo_video_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600">
                              <Video className="w-4 h-4" />
                              Demo Video
                            </a>
                          )}
                          {project.github_url && (
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600">
                              <Github className="w-4 h-4" />
                              GitHub
                            </a>
                          )}
                          {project.live_demo_url && (
                            <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600">
                              <ExternalLink className="w-4 h-4" />
                              Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setEditingItem(project); setEditingType('project'); }}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteItem('project', project.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Skills Management</h2>
              <Button onClick={() => { setCreateType('skill'); setShowCreateDialog(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['frontend', 'backend', 'ai', 'tools'].map((category) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="capitalize">{category} Skills</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {skills.filter(skill => skill.category === category).map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{skill.name}</span>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={() => { setEditingItem(skill); setEditingType('skill'); }}>
                                <Edit2 className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => deleteItem('skill', skill.id)}>
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{skill.level}%</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Certifications Tab */}
          <TabsContent value="certifications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Certifications Management</h2>
              <Button onClick={() => { setCreateType('certification'); setShowCreateDialog(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Certification
              </Button>
            </div>
            
            <div className="grid gap-4">
              {certifications.map((cert) => (
                <Card key={cert.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <Award className="w-5 h-5 text-primary" />
                          <h3 className="font-medium">{cert.name}</h3>
                          {!cert.is_active && <Badge variant="outline">Inactive</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {cert.issuer} • {new Date(cert.issue_date).getFullYear()}
                        </p>
                        {cert.credential_url && (
                          <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600">
                            View Credential
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setEditingItem(cert); setEditingType('certification'); }}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteItem('certification', cert.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Experience & Education Management</h2>
              <Button onClick={() => { setCreateType('experience'); setShowCreateDialog(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Experience/Education
              </Button>
            </div>
            
            <div className="grid gap-4">
              {experiences.map((exp) => (
                <Card key={exp.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          {exp.type === 'education' ? <GraduationCap className="w-5 h-5 text-primary" /> : <Briefcase className="w-5 h-5 text-primary" />}
                          <h3 className="font-medium">{exp.title}</h3>
                          <Badge variant="outline" className="capitalize">{exp.type}</Badge>
                          {exp.is_current && <Badge>Current</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {exp.organization} • {exp.location}
                        </p>
                        <p className="text-sm">
                          {new Date(exp.start_date).getFullYear()} - {exp.end_date ? new Date(exp.end_date).getFullYear() : 'Present'}
                        </p>
                        {exp.description && <p className="text-sm">{exp.description}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setEditingItem(exp); setEditingType('experience'); }}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteItem('experience', exp.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Articles & Blog Management</h2>
              <Button onClick={() => { setCreateType('article'); setShowCreateDialog(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Article
              </Button>
            </div>
            
            <div className="grid gap-4">
              {articles.map((article) => (
                <Card key={article.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-5 h-5 text-primary" />
                          <h3 className="font-medium">{article.title}</h3>
                          {article.is_published ? <Badge>Published</Badge> : <Badge variant="outline">Draft</Badge>}
                          {article.is_featured && <Badge>Featured</Badge>}
                        </div>
                        {article.subtitle && <p className="text-sm text-muted-foreground">{article.subtitle}</p>}
                        {article.excerpt && <p className="text-sm">{article.excerpt}</p>}
                        <div className="flex gap-4 text-sm">
                          {article.article_url && (
                            <a href={article.article_url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                              View Article
                            </a>
                          )}
                          {article.pdf_url && (
                            <a href={article.pdf_url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                              Download PDF
                            </a>
                          )}
                          <span>Views: {article.view_count}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setEditingItem(article); setEditingType('article'); }}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteItem('article', article.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* CV Management Tab - Keep existing */}
          <TabsContent value="cv-management" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">CV Management</h2>
              <div className="flex gap-4">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                  id="cv-upload"
                />
                <Button onClick={() => document.getElementById('cv-upload')?.click()} disabled={uploading}>
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload New CV'}
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {cvFiles.map((cv) => (
                <Card key={cv.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium">{cv.filename}</h3>
                          {cv.is_active && <Badge className="bg-green-100 text-green-800">Active</Badge>}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Version {cv.version} • {Math.round(cv.file_size / 1024)} KB • 
                          Uploaded {new Date(cv.upload_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!cv.is_active && (
                          <Button variant="outline" size="sm" onClick={() => setActiveCV(cv.id)}>
                            Set Active
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Contacts Tab - Keep existing */}
          <TabsContent value="contacts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Contact Form Submissions</h2>
              <Badge variant="outline">
                {contactSubmissions.filter(c => c.status === 'new').length} New
              </Badge>
            </div>

            <div className="grid gap-4">
              {contactSubmissions.map((submission) => (
                <Card key={submission.id} className={submission.status === 'new' ? 'border-primary' : ''}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">{submission.first_name} {submission.last_name}</h3>
                            <Badge variant={submission.status === 'new' ? 'default' : 'secondary'}>
                              {submission.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {submission.email} • {new Date(submission.created_at).toLocaleString()}
                          </div>
                        </div>
                        {submission.status === 'new' && (
                          <Button variant="outline" size="sm" onClick={() => markAsResponded(submission.id)}>
                            Mark as Responded
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium">Subject: </span>
                          <span>{submission.subject}</span>
                        </div>
                        <div>
                          <span className="font-medium">Message:</span>
                          <p className="mt-1 text-sm bg-muted p-3 rounded-lg">{submission.message}</p>
                        </div>
                      </div>
                      
                      {submission.responded_at && (
                        <div className="text-sm text-muted-foreground">
                          Responded: {new Date(submission.responded_at).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {contactSubmissions.length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    No contact submissions yet.
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Create/Edit Dialog - Basic implementation */}
        <Dialog open={showCreateDialog || !!editingItem} onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false);
            setEditingItem(null);
            setEditingType('');
            setCreateType('');
          }
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? `Edit ${editingType}` : `Create New ${createType}`}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This is a simplified dialog. You can expand this to include full form fields for each content type.
              </p>
              
              <div className="flex gap-2">
                <Button onClick={() => {
                  setShowCreateDialog(false);
                  setEditingItem(null);
                }}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  // Implement save logic here
                  setShowCreateDialog(false);
                  setEditingItem(null);
                }}>
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
