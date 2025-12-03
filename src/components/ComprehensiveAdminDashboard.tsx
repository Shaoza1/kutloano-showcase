import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, Upload, Eye, Download, BarChart, FolderOpen, BookOpen, GraduationCap, Award, Briefcase, FileText, FileUp, Mail, TrendingUp, LayoutDashboard } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import CourseManagement from "@/components/CourseManagement";

function ProjectForm({ project, onSuccess }: { project?: any; onSuccess: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: project || {
      title: "",
      subtitle: "",
      description: "",
      live_demo_url: "",
      github_url: "",
      demo_video_url: "",
      images: [],
      sort_order: 0,
      is_published: true,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (project) {
        const { error } = await supabase.from("portfolio_projects").update(data).eq("id", project.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("portfolio_projects").insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: `Project ${project ? "updated" : "added"} successfully` });
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      onSuccess();
      reset();
    },
  });

  async function onSubmit(data: any) {
    await mutation.mutateAsync(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title", { required: "Title is required" })} />
        {errors.title?.message && <p className="text-destructive text-sm">{String(errors.title.message)}</p>}
      </div>
      <div>
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input id="subtitle" {...register("subtitle")} />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} />
      </div>
      <div>
        <Label htmlFor="live_demo_url">Live Demo URL</Label>
        <Input id="live_demo_url" {...register("live_demo_url")} />
      </div>
      <div>
        <Label htmlFor="github_url">GitHub URL</Label>
        <Input id="github_url" {...register("github_url")} />
      </div>
      <div>
        <Label htmlFor="demo_video_url">Demo Video URL</Label>
        <Input id="demo_video_url" {...register("demo_video_url")} />
      </div>
      <div>
        <Label htmlFor="sort_order">Sort Order</Label>
        <Input type="number" id="sort_order" {...register("sort_order", { valueAsNumber: true })} />
      </div>
      <div className="flex items-center space-x-2">
        <Controller
          control={control}
          name="is_published"
          render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
        />
        <Label>Published</Label>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
        {project ? "Update Project" : "Add Project"}
      </Button>
    </form>
  );
}

function CaseStudyForm({
  caseStudy,
  projects,
  onSuccess,
}: {
  caseStudy?: any;
  projects: any[];
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: caseStudy || {
      title: "",
      project_id: projects.length > 0 ? projects[0].id : "",
      description: "",
      video_urls: [],
      document_urls: [],
      image_gallery: [],
      sort_order: 0,
      is_published: true,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (caseStudy) {
        const { error } = await supabase.from("portfolio_case_studies").update(data).eq("id", caseStudy.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("portfolio_case_studies").insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: `Case study ${caseStudy ? "updated" : "added"} successfully` });
      queryClient.invalidateQueries({ queryKey: ["admin-case-studies"] });
      onSuccess();
      reset();
    },
  });

  async function onSubmit(data: any) {
    // Ensure arrays are stored properly
    if (typeof data.video_urls === "string") {
      data.video_urls = data.video_urls.split(",").map((s: string) => s.trim()).filter(Boolean);
    }
    if (typeof data.document_urls === "string") {
      data.document_urls = data.document_urls.split(",").map((s: string) => s.trim()).filter(Boolean);
    }
    if (typeof data.image_gallery === "string") {
      data.image_gallery = data.image_gallery.split(",").map((s: string) => s.trim()).filter(Boolean);
    }
    await mutation.mutateAsync(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title", { required: "Title is required" })} />
        {errors.title?.message && <p className="text-destructive text-sm">{String(errors.title.message)}</p>}
      </div>
      <div>
        <Label htmlFor="project_id">Project</Label>
        <Controller
          control={control}
          name="project_id"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} />
      </div>
      <div>
        <Label htmlFor="video_urls">Video URLs (comma separated)</Label>
        <Textarea id="video_urls" {...register("video_urls")} />
      </div>
      <div>
        <Label htmlFor="document_urls">Document URLs (comma separated)</Label>
        <Textarea id="document_urls" {...register("document_urls")} />
      </div>
      <div>
        <Label htmlFor="image_gallery">Image URLs (comma separated)</Label>
        <Textarea id="image_gallery" {...register("image_gallery")} />
      </div>
      <div>
        <Label htmlFor="sort_order">Sort Order</Label>
        <Input type="number" id="sort_order" {...register("sort_order", { valueAsNumber: true })} />
      </div>
      <div className="flex items-center space-x-2">
        <Controller
          control={control}
          name="is_published"
          render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
        />
        <Label>Published</Label>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
        {caseStudy ? "Update Case Study" : "Add Case Study"}
      </Button>
    </form>
  );
}

export default function ComprehensiveAdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("projects");
  const [editingItem, setEditingItem] = useState<any>(null);

  // Fetch all data
  const { data: projects } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("portfolio_projects").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: skills } = useQuery({
    queryKey: ["admin-skills"],
    queryFn: async () => {
      const { data, error } = await supabase.from("portfolio_skills").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: certifications } = useQuery({
    queryKey: ["admin-certifications"],
    queryFn: async () => {
      const { data, error } = await supabase.from("portfolio_certifications").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: experience } = useQuery({
    queryKey: ["admin-experience"],
    queryFn: async () => {
      const { data, error } = await supabase.from("portfolio_experience").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: articles } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("portfolio_articles").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: caseStudies } = useQuery({
    queryKey: ["admin-case-studies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_case_studies")
        .select("*, portfolio_projects(title)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: cvFiles } = useQuery({
    queryKey: ["admin-cv-files"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cv_management").select("*").order("version", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: contactSubmissions } = useQuery({
    queryKey: ["admin-contacts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: analytics } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_analytics")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  // Delete mutations
  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("portfolio_projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      toast({ title: "Project deleted successfully" });
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("portfolio_skills").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-skills"] });
      toast({ title: "Skill deleted successfully" });
    },
  });

  const deleteCertificationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("portfolio_certifications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certifications"] });
      toast({ title: "Certification deleted successfully" });
    },
  });

  const deleteExperienceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("portfolio_experience").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-experience"] });
      toast({ title: "Experience deleted successfully" });
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("portfolio_articles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      toast({ title: "Article deleted successfully" });
    },
  });

  const deleteCaseStudyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("portfolio_case_studies").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-case-studies"] });
      toast({ title: "Case study deleted successfully" });
    },
  });

  const deleteCvMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cv_management").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cv-files"] });
      toast({ title: "CV file deleted successfully" });
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header Section */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <LayoutDashboard className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Portfolio Admin</h1>
              <p className="text-sm text-muted-foreground">Manage your portfolio content</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap h-auto gap-1 p-1 bg-muted/50 rounded-xl mb-6">
            <TabsTrigger value="projects" className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
              <FolderOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="case-studies" className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Case Studies</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Courses</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Skills</span>
            </TabsTrigger>
            <TabsTrigger value="certifications" className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Certs</span>
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Experience</span>
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Articles</span>
            </TabsTrigger>
            <TabsTrigger value="cv" className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
              <FileUp className="h-4 w-4" />
              <span className="hidden sm:inline">CV</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Contacts</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

        {/* PROJECTS TAB */}
        <TabsContent value="projects">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manage Projects</CardTitle>
                <CardDescription>Add videos, live demos, GitHub links, and images</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Project</DialogTitle>
                  </DialogHeader>
                  <ProjectForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ["admin-projects"] })} />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects?.map((project) => (
                  <Card key={project.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{project.title}</h3>
                          <p className="text-sm text-muted-foreground">{project.subtitle}</p>
                          <div className="mt-2 space-y-1 text-sm">
                            {project.live_demo_url && <p>🔗 Live Demo: {project.live_demo_url}</p>}
                            {project.github_url && <p>💻 GitHub: {project.github_url}</p>}
                            {project.demo_video_url && <p>🎥 Video: {project.demo_video_url}</p>}
                            {project.images && project.images.length > 0 && <p>🖼️ Images: {project.images.length}</p>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Edit Project</DialogTitle>
                              </DialogHeader>
                              <ProjectForm
                                project={project}
                                onSuccess={() => queryClient.invalidateQueries({ queryKey: ["admin-projects"] })}
                              />
                            </DialogContent>
                          </Dialog>
                          <Button variant="destructive" size="sm" onClick={() => deleteProjectMutation.mutate(project.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CASE STUDIES TAB */}
        <TabsContent value="case-studies">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manage Case Studies</CardTitle>
                <CardDescription>Detailed project documentation with videos and documents</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Case Study
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Case Study</DialogTitle>
                  </DialogHeader>
                  <CaseStudyForm
                    projects={projects || []}
                    onSuccess={() => queryClient.invalidateQueries({ queryKey: ["admin-case-studies"] })}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {caseStudies?.map((study: any) => (
                  <Card key={study.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{study.title}</h3>
                          <p className="text-sm text-muted-foreground">Project: {study.portfolio_projects?.title}</p>
                          <div className="mt-2 space-y-1 text-sm">
                            {study.video_urls && study.video_urls.length > 0 && <p>🎥 Videos: {study.video_urls.length}</p>}
                            {study.document_urls && study.document_urls.length > 0 && <p>📄 Documents: {study.document_urls.length}</p>}
                            {study.image_gallery && study.image_gallery.length > 0 && <p>🖼️ Images: {study.image_gallery.length}</p>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Edit Case Study</DialogTitle>
                              </DialogHeader>
                              <CaseStudyForm
                                caseStudy={study}
                                projects={projects || []}
                                onSuccess={() => queryClient.invalidateQueries({ queryKey: ["admin-case-studies"] })}
                              />
                            </DialogContent>
                          </Dialog>
                          <Button variant="destructive" size="sm" onClick={() => deleteCaseStudyMutation.mutate(study.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* COURSES TAB */}
        <TabsContent value="courses">
          <CourseManagement />
        </TabsContent>

        {/* SKILLS TAB */}
        <TabsContent value="skills">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manage Skills</CardTitle>
                <CardDescription>Add and organize your skills</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Skill
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Skill</DialogTitle>
                  </DialogHeader>
                  <SkillForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ["admin-skills"] })} />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skills?.map((skill) => (
                  <Card key={skill.id}>
                    <CardContent className="pt-6 flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg">{skill.name}</h3>
                        <p className="text-sm text-muted-foreground">{skill.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Skill</DialogTitle>
                            </DialogHeader>
                            <SkillForm skill={skill} onSuccess={() => queryClient.invalidateQueries({ queryKey: ["admin-skills"] })} />
                          </DialogContent>
                        </Dialog>
                        <Button variant="destructive" size="sm" onClick={() => deleteSkillMutation.mutate(skill.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CERTIFICATIONS TAB */}
        <TabsContent value="certifications">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manage Certifications</CardTitle>
                <CardDescription>Add and organize your certifications</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Certification
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Certification</DialogTitle>
                  </DialogHeader>
                  <CertificationForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ["admin-certifications"] })} />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certifications?.map((cert) => (
                  <Card key={cert.id}>
                    <CardContent className="pt-6 flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg">{cert.name}</h3>
                        <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Certification</DialogTitle>
                            </DialogHeader>
                            <CertificationForm
                              certification={cert}
                              onSuccess={() => queryClient.invalidateQueries({ queryKey: ["admin-certifications"] })}
                            />
                          </DialogContent>
                        </Dialog>
                        <Button variant="destructive" size="sm" onClick={() => deleteCertificationMutation.mutate(cert.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* EXPERIENCE TAB */}
        <TabsContent value="experience">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manage Experience</CardTitle>
                <CardDescription>Add and organize your work experience</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Experience
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Experience</DialogTitle>
                  </DialogHeader>
                  <ExperienceForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ["admin-experience"] })} />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {experience?.map((exp) => (
                  <Card key={exp.id}>
                    <CardContent className="pt-6 flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg">{exp.title}</h3>
                        <p className="text-sm text-muted-foreground">{exp.organization}</p>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Experience</DialogTitle>
                            </DialogHeader>
                            <ExperienceForm
                              experience={exp}
                              onSuccess={() => queryClient.invalidateQueries({ queryKey: ["admin-experience"] })}
                            />
                          </DialogContent>
                        </Dialog>
                        <Button variant="destructive" size="sm" onClick={() => deleteExperienceMutation.mutate(exp.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ARTICLES TAB */}
        <TabsContent value="articles">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manage Articles</CardTitle>
                <CardDescription>Add and organize your articles</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Article
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Article</DialogTitle>
                  </DialogHeader>
                  <ArticleForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ["admin-articles"] })} />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {articles?.map((article) => (
                  <Card key={article.id}>
                    <CardContent className="pt-6 flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg">{article.title}</h3>
                        <p className="text-sm text-muted-foreground">{article.excerpt}</p>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Article</DialogTitle>
                            </DialogHeader>
                            <ArticleForm article={article} onSuccess={() => queryClient.invalidateQueries({ queryKey: ["admin-articles"] })} />
                          </DialogContent>
                        </Dialog>
                        <Button variant="destructive" size="sm" onClick={() => deleteArticleMutation.mutate(article.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CV TAB */}
        <TabsContent value="cv">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manage CV Files</CardTitle>
                <CardDescription>Upload and manage your CV versions</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add CV
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New CV</DialogTitle>
                  </DialogHeader>
                  <CvForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ["admin-cv-files"] })} />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cvFiles?.map((cv) => (
                  <Card key={cv.id}>
                    <CardContent className="pt-6 flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg">Version {cv.version}</h3>
                        <p className="text-sm text-muted-foreground">{cv.filename}</p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded: {new Date(cv.upload_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="destructive" size="sm" onClick={() => deleteCvMutation.mutate(cv.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONTACTS TAB */}
        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Contact Submissions</CardTitle>
              <CardDescription>View messages sent through the contact form</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contactSubmissions?.map((contact) => (
                  <Card key={contact.id}>
                    <CardContent className="pt-6">
                      <p>
                        <strong>Name:</strong> {contact.first_name} {contact.last_name}
                      </p>
                      <p>
                        <strong>Email:</strong> {contact.email}
                      </p>
                      <p>
                        <strong>Message:</strong> {contact.message}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Sent at: {new Date(contact.created_at).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ANALYTICS TAB */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Site Analytics</CardTitle>
              <CardDescription>View recent site analytics data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">Recent site activity:</p>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse border border-gray-300">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 px-4 py-2">Date</th>
                        <th className="border border-gray-300 px-4 py-2">Event Type</th>
                        <th className="border border-gray-300 px-4 py-2">IP Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics?.map((entry) => (
                        <tr key={entry.id}>
                          <td className="border border-gray-300 px-4 py-2">{new Date(entry.created_at).toLocaleString()}</td>
                          <td className="border border-gray-300 px-4 py-2">{entry.event_type}</td>
                          <td className="border border-gray-300 px-4 py-2">{String(entry.ip_address || 'N/A')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}

// Additional forms for Skills, Certifications, Experience, Articles, CV

function SkillForm({ skill, onSuccess }: { skill?: any; onSuccess: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: skill || {
      name: "",
      description: "",
      sort_order: 0,
      is_published: true,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (skill) {
        const { error } = await supabase.from("portfolio_skills").update(data).eq("id", skill.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("portfolio_skills").insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: `Skill ${skill ? "updated" : "added"} successfully` });
      queryClient.invalidateQueries({ queryKey: ["admin-skills"] });
      onSuccess();
      reset();
    },
  });

  async function onSubmit(data: any) {
    await mutation.mutateAsync(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name", { required: "Name is required" })} />
        {errors.name?.message && <p className="text-destructive text-sm">{String(errors.name.message)}</p>}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} />
      </div>
      <div>
        <Label htmlFor="sort_order">Sort Order</Label>
        <Input type="number" id="sort_order" {...register("sort_order", { valueAsNumber: true })} />
      </div>
      <div className="flex items-center space-x-2">
        <Controller
          control={useForm().control}
          name="is_published"
          defaultValue={skill?.is_published ?? true}
          render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
        />
        <Label>Published</Label>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
        {skill ? "Update Skill" : "Add Skill"}
      </Button>
    </form>
  );
}

function CertificationForm({ certification, onSuccess }: { certification?: any; onSuccess: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: certification || {
      name: "",
      issuer: "",
      issue_date: "",
      expiration_date: "",
      credential_url: "",
      sort_order: 0,
      is_published: true,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (certification) {
        const { error } = await supabase.from("portfolio_certifications").update(data).eq("id", certification.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("portfolio_certifications").insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: `Certification ${certification ? "updated" : "added"} successfully` });
      queryClient.invalidateQueries({ queryKey: ["admin-certifications"] });
      onSuccess();
      reset();
    },
  });

  async function onSubmit(data: any) {
    await mutation.mutateAsync(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name", { required: "Name is required" })} />
        {errors.name?.message && <p className="text-destructive text-sm">{String(errors.name.message)}</p>}
      </div>
      <div>
        <Label htmlFor="issuer">Issuer</Label>
        <Input id="issuer" {...register("issuer")} />
      </div>
      <div>
        <Label htmlFor="issue_date">Issue Date</Label>
        <Input type="date" id="issue_date" {...register("issue_date")} />
      </div>
      <div>
        <Label htmlFor="expiration_date">Expiration Date</Label>
        <Input type="date" id="expiration_date" {...register("expiration_date")} />
      </div>
      <div>
        <Label htmlFor="credential_url">Credential URL</Label>
        <Input id="credential_url" {...register("credential_url")} />
      </div>
      <div>
        <Label htmlFor="sort_order">Sort Order</Label>
        <Input type="number" id="sort_order" {...register("sort_order", { valueAsNumber: true })} />
      </div>
      <div className="flex items-center space-x-2">
        <Controller
          control={useForm().control}
          name="is_published"
          defaultValue={certification?.is_published ?? true}
          render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
        />
        <Label>Published</Label>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
        {certification ? "Update Certification" : "Add Certification"}
      </Button>
    </form>
  );
}

function ExperienceForm({ experience, onSuccess }: { experience?: any; onSuccess: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: experience || {
      title: "",
      organization: "",
      start_date: "",
      end_date: "",
      description: "",
      type: "work",
      sort_order: 0,
      is_active: true,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (experience) {
        const { error } = await supabase.from("portfolio_experience").update(data).eq("id", experience.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("portfolio_experience").insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: `Experience ${experience ? "updated" : "added"} successfully` });
      queryClient.invalidateQueries({ queryKey: ["admin-experience"] });
      onSuccess();
      reset();
    },
  });

  async function onSubmit(data: any) {
    await mutation.mutateAsync(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title", { required: "Title is required" })} />
        {errors.title?.message && <p className="text-destructive text-sm">{String(errors.title.message)}</p>}
      </div>
      <div>
        <Label htmlFor="organization">Organization</Label>
        <Input id="organization" {...register("organization")} />
      </div>
      <div>
        <Label htmlFor="start_date">Start Date</Label>
        <Input type="date" id="start_date" {...register("start_date")} />
      </div>
      <div>
        <Label htmlFor="end_date">End Date</Label>
        <Input type="date" id="end_date" {...register("end_date")} />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} />
      </div>
      <div>
        <Label htmlFor="sort_order">Sort Order</Label>
        <Input type="number" id="sort_order" {...register("sort_order", { valueAsNumber: true })} />
      </div>
      <div className="flex items-center space-x-2">
        <Controller
          control={useForm().control}
          name="is_published"
          defaultValue={experience?.is_published ?? true}
          render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
        />
        <Label>Published</Label>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
        {experience ? "Update Experience" : "Add Experience"}
      </Button>
    </form>
  );
}

function ArticleForm({ article, onSuccess }: { article?: any; onSuccess: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: article || {
      title: "",
      excerpt: "",
      content: "",
      sort_order: 0,
      is_published: true,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (article) {
        const { error } = await supabase.from("portfolio_articles").update(data).eq("id", article.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("portfolio_articles").insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: `Article ${article ? "updated" : "added"} successfully` });
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      onSuccess();
      reset();
    },
  });

  async function onSubmit(data: any) {
    await mutation.mutateAsync(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title", { required: "Title is required" })} />
        {errors.title?.message && <p className="text-destructive text-sm">{String(errors.title.message)}</p>}
      </div>
      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" {...register("excerpt")} />
      </div>
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" {...register("content")} />
      </div>
      <div>
        <Label htmlFor="sort_order">Sort Order</Label>
        <Input type="number" id="sort_order" {...register("sort_order", { valueAsNumber: true })} />
      </div>
      <div className="flex items-center space-x-2">
        <Controller
          control={useForm().control}
          name="is_published"
          defaultValue={article?.is_published ?? true}
          render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
        />
        <Label>Published</Label>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
        {article ? "Update Article" : "Add Article"}
      </Button>
    </form>
  );
}

function CvForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      version: "",
      description: "",
    },
  });

  const uploadFile = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `cv_${Date.now()}.${fileExt}`;
    const filePath = `cv/${fileName}`;

    const { error: uploadError } = await supabase.storage.from("cv-files").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) {
      throw uploadError;
    }

    return { filePath, fileName };
  };

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (!file) throw new Error("File is required");
      setUploading(true);
      const { filePath, fileName } = await uploadFile(file);
      setUploading(false);

      const insertData = {
        filename: fileName,
        file_path: filePath,
        file_size: file.size,
        version: parseInt(data.version) || 1,
      };

      const { error } = await supabase.from("cv_management").insert(insertData);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "CV uploaded successfully" });
      queryClient.invalidateQueries({ queryKey: ["admin-cv-files"] });
      onSuccess();
      reset();
      setFile(null);
    },
  });

  async function onSubmit(data: any) {
    await mutation.mutateAsync(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="version">Version</Label>
        <Input id="version" {...register("version", { required: "Version is required" })} />
        {errors.version && <p className="text-destructive text-sm">{errors.version.message}</p>}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} />
      </div>
      <div>
        <Label htmlFor="file">CV File (PDF)</Label>
        <Input
          type="file"
          id="file"
          accept="application/pdf"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setFile(e.target.files[0]);
            }
          }}
        />
      </div>
      <Button type="submit" disabled={isSubmitting || uploading}>
        {(isSubmitting || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Upload CV
      </Button>
    </form>
  );
}
