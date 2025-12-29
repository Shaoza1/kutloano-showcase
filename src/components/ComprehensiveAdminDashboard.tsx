import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, SUPABASE_URL } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, Upload, Image, Video, FileText, ExternalLink, FolderOpen, BookOpen, GraduationCap, Award, Briefcase, Mail, TrendingUp, LayoutDashboard } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import CourseManagement from "@/components/CourseManagement";
import CVManagement from "@/components/CVManagement";

function ProjectForm({ project, onSuccess }: { project?: any; onSuccess: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  
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
      long_description: "",
      technologies: [],
      category: [],
      status: "Development",
      year: new Date().getFullYear().toString(),
      duration: "",
      team: "",
      live_demo_url: "",
      github_url: "",
      demo_video_url: "",
      images: [],
      sort_order: 0,
      is_published: true,
    },
  });

  const uploadImages = async (files: File[]) => {
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;
      return filePath;
    });

    return Promise.all(uploadPromises);
  };

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      let imageUrls = data.images || [];

      if (images.length > 0) {
        setUploading(true);
        const uploadedPaths = await uploadImages(images);
        imageUrls = [...imageUrls, ...uploadedPaths];
        setUploading(false);
      }

      const submitData = {
        ...data,
        images: imageUrls,
        technologies: Array.isArray(data.technologies) 
          ? data.technologies 
          : data.technologies?.split(',').map((t: string) => t.trim()).filter(Boolean) || [],
        category: Array.isArray(data.category) 
          ? data.category 
          : data.category?.split(',').map((c: string) => c.trim()).filter(Boolean) || [],
      };

      if (project) {
        const { error } = await supabase.from("portfolio_projects").update(submitData).eq("id", project.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("portfolio_projects").insert(submitData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: `Project ${project ? "updated" : "added"} successfully` });
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      onSuccess();
      reset();
      setImages([]);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  async function onSubmit(data: any) {
    await mutation.mutateAsync(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input id="title" {...register("title", { required: "Title is required" })} />
          {errors.title?.message && <p className="text-destructive text-sm">{String(errors.title.message)}</p>}
        </div>
        <div>
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input id="subtitle" {...register("subtitle")} />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Short Description *</Label>
        <Textarea id="description" rows={2} {...register("description", { required: "Description is required" })} />
        {errors.description?.message && <p className="text-destructive text-sm">{String(errors.description.message)}</p>}
      </div>
      
      <div>
        <Label htmlFor="long_description">Long Description</Label>
        <Textarea id="long_description" rows={4} {...register("long_description")} />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="technologies">Technologies (comma-separated)</Label>
          <Input id="technologies" placeholder="React, TypeScript, Node.js" {...register("technologies")} />
        </div>
        <div>
          <Label htmlFor="category">Categories (comma-separated)</Label>
          <Input id="category" placeholder="Web, AI, PWA" {...register("category")} />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Input id="status" placeholder="Production, Development" {...register("status")} />
        </div>
        <div>
          <Label htmlFor="year">Year</Label>
          <Input id="year" {...register("year")} />
        </div>
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input id="duration" placeholder="2 months" {...register("duration")} />
        </div>
      </div>
      
      <div>
        <Label htmlFor="team">Team Role</Label>
        <Input id="team" placeholder="Lead Developer" {...register("team")} />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="live_demo_url">Live Demo URL</Label>
          <Input id="live_demo_url" type="url" {...register("live_demo_url")} />
        </div>
        <div>
          <Label htmlFor="github_url">GitHub URL</Label>
          <Input id="github_url" type="url" {...register("github_url")} />
        </div>
      </div>
      
      <div>
        <Label htmlFor="demo_video_url">Demo Video URL</Label>
        <Input id="demo_video_url" type="url" {...register("demo_video_url")} />
      </div>
      
      <div>
        <Label htmlFor="images">Project Images</Label>
        <Input
          type="file"
          id="images"
          multiple
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) {
              setImages(Array.from(e.target.files));
            }
          }}
        />
        {images.length > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            {images.length} image(s) selected
          </p>
        )}
        {project?.images && project.images.length > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            Current: {project.images.length} image(s)
          </p>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
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
      </div>
      
      <Button type="submit" disabled={isSubmitting || uploading}>
        {(isSubmitting || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {project ? "Update Project" : "Add Project"}
      </Button>
    </form>
  );
}

export default function ComprehensiveAdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("projects");

  const { data: projects } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("portfolio_projects").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("portfolio_projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Project deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
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
            <TabsTrigger value="certs" className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
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
              <Upload className="h-4 w-4" />
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
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
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
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-bold text-lg">{project.title}</h3>
                              {!project.is_published && (
                                <Badge variant="outline" className="text-xs">Draft</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{project.subtitle}</p>
                            <p className="text-sm mb-3">{project.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              {project.technologies?.slice(0, 3).map((tech: string) => (
                                <Badge key={tech} variant="secondary" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                              {project.technologies?.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{project.technologies.length - 3}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="space-y-1 text-sm">
                              {project.live_demo_url && (
                                <div className="flex items-center gap-2">
                                  <ExternalLink className="w-4 h-4" />
                                  <span>Live Demo: {project.live_demo_url}</span>
                                </div>
                              )}
                              {project.github_url && (
                                <div className="flex items-center gap-2">
                                  <FolderOpen className="w-4 h-4" />
                                  <span>GitHub: {project.github_url}</span>
                                </div>
                              )}
                              {project.demo_video_url && (
                                <div className="flex items-center gap-2">
                                  <Video className="w-4 h-4" />
                                  <span>Video: {project.demo_video_url}</span>
                                </div>
                              )}
                              {project.images && project.images.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <Image className="w-4 h-4" />
                                  <span>{project.images.length} image(s)</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Edit Project</DialogTitle>
                                </DialogHeader>
                                <ProjectForm
                                  project={project}
                                  onSuccess={() => queryClient.invalidateQueries({ queryKey: ["admin-projects"] })}
                                />
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => deleteProjectMutation.mutate(project.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {!projects || projects.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No projects added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <CourseManagement />
          </TabsContent>

          <TabsContent value="case-studies">
            <Card>
              <CardHeader>
                <CardTitle>Manage Case Studies</CardTitle>
                <CardDescription>Detailed project breakdowns and analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Case studies management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Manage Skills</CardTitle>
                <CardDescription>Update your technical skills and proficiency levels</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Skills management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certs">
            <Card>
              <CardHeader>
                <CardTitle>Manage Certifications</CardTitle>
                <CardDescription>Add and update your professional certifications</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Certifications management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <CardTitle>Manage Work Experience</CardTitle>
                <CardDescription>Update your professional work history</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Experience management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="articles">
            <Card>
              <CardHeader>
                <CardTitle>Manage Articles</CardTitle>
                <CardDescription>Write and publish technical articles</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Articles management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cv">
            <Card>
              <CardHeader>
                <CardTitle>Manage CV/Resume</CardTitle>
                <CardDescription>Upload and manage your resume documents</CardDescription>
              </CardHeader>
              <CardContent>
                <CVManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>Manage Contact Information</CardTitle>
                <CardDescription>Update your contact details and social links</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Contact management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Analytics</CardTitle>
                <CardDescription>View portfolio performance and visitor statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}